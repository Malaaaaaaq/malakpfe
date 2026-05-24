<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use App\Models\NewsletterSubscriber;
use App\Mail\PromoCodeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class PromoController extends Controller
{
    private function checkAdmin(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(response()->json(['message' => 'Accès refusé. Rôle administrateur requis.'], 403));
        }
    }

    public function index(Request $request)
    {
        $this->checkAdmin($request);
        return response()->json(PromoCode::orderByDesc('created_at')->get());
    }

    public function store(Request $request)
    {
        $this->checkAdmin($request);

        $data = $request->validate([
            'code' => 'required|string|max:30|unique:promo_codes,code',
            'type' => 'required|in:percent,flat',
            'discount' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'required|boolean',
        ]);

        $promo = PromoCode::create([
            'code' => strtoupper($data['code']),
            'type' => $data['type'],
            'discount' => $data['discount'],
            'max_uses' => $data['max_uses'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
            'is_active' => $data['is_active'],
            'uses_count' => 0,
        ]);

        return response()->json([
            'message' => 'Code promo créé avec succès.',
            'promo' => $promo
        ], 201);
    }

    public function update(Request $request, PromoCode $promo)
    {
        $this->checkAdmin($request);

        $data = $request->validate([
            'type' => 'sometimes|required|in:percent,flat',
            'discount' => 'sometimes|required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'required|boolean',
        ]);

        $promo->fill([
            'type' => $data['type'] ?? $promo->type,
            'discount' => $data['discount'] ?? $promo->discount,
            'max_uses' => array_key_exists('max_uses', $data) ? $data['max_uses'] : $promo->max_uses,
            'expires_at' => array_key_exists('expires_at', $data) ? $data['expires_at'] : $promo->expires_at,
            'is_active' => $data['is_active'],
        ]);

        $promo->save();

        return response()->json([
            'message' => 'Code promo mis à jour avec succès.',
            'promo' => $promo
        ]);
    }

    public function toggleActive(Request $request, PromoCode $promo)
    {
        $this->checkAdmin($request);
        $data = $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $promo->update(['is_active' => $data['is_active']]);

        return response()->json([
            'message' => 'Statut promo mis à jour.',
            'promo' => $promo
        ]);
    }

    public function destroy(Request $request, PromoCode $promo)
    {
        $this->checkAdmin($request);

        $promo->delete();

        return response()->json(['message' => 'Code promo supprimé avec succès.']);
    }

    public function validateCode(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:30',
            'amount' => 'nullable|numeric|min:0',
        ]);

        $promo = PromoCode::where('code', strtoupper($data['code']))
            ->where('is_active', true)
            ->first();

        if (!$promo) {
            return response()->json(['message' => 'Code promo invalide ou introuvable.'], 422);
        }

        if ($promo->expires_at && $promo->expires_at->isPast()) {
            return response()->json(['message' => 'Ce code promo a expiré.'], 422);
        }

        if ($promo->max_uses !== null && $promo->uses_count >= $promo->max_uses) {
            return response()->json(['message' => 'Ce code promo a atteint son nombre d\'utilisations maximum.'], 422);
        }

        $amount = $data['amount'] ?? 0;
        $discount = $promo->type === 'percent'
            ? round($amount * ($promo->discount / 100), 2)
            : min($promo->discount, $amount);

        return response()->json([
            'promo' => [
                'code' => $promo->code,
                'type' => $promo->type,
                'discount' => $promo->discount,
            ],
            'discount' => $discount,
            'final_amount' => max($amount - $discount, 0),
        ]);
    }

    /**
     * Return active promo codes for clients (authenticated users).
     */
    public function active(Request $request)
    {
        // Only return promos that are active, not expired and not overused
        $promos = PromoCode::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->get()
            ->filter(function ($p) {
                return $p->max_uses === null || $p->uses_count < $p->max_uses;
            })
            ->map(fn($p) => [
                'id' => $p->id,
                'code' => $p->code,
                'type' => $p->type,
                'discount' => $p->discount,
            ])
            ->values();

        return response()->json($promos);
    }

    /**
     * Send a promo code to all active newsletter subscribers.
     */
    public function sendToSubscribers(Request $request, PromoCode $promo)
    {
        $this->checkAdmin($request);

        $subscribers = NewsletterSubscriber::where('is_active', true)->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['message' => 'Aucun abonné à la newsletter.'], 404);
        }

        $sent = 0;
        $errors = 0;

        foreach ($subscribers as $sub) {
            try {
                Mail::to($sub->email)->send(new PromoCodeEmail(
                    $promo->code,
                    $promo->discount,
                    $promo->type,
                    $promo->expires_at?->format('d/m/Y')
                ));
                $sent++;
            } catch (\Exception $e) {
                Log::error("Erreur envoi promo à {$sub->email}: " . $e->getMessage());
                $errors++;
            }
        }

        return response()->json([
            'message' => "Code promo envoyé à {$sent} abonné(s)" . ($errors ? " ({$errors} erreur(s))" : ""),
            'sent' => $sent,
            'errors' => $errors,
        ]);
    }

    /**
     * Apply a promo code (increment uses_count).
     */
    public function apply(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:30',
        ]);

        $promo = PromoCode::where('code', strtoupper($data['code']))
            ->where('is_active', true)
            ->first();

        if (!$promo) {
            return response()->json(['message' => 'Code promo invalide.'], 422);
        }

        if ($promo->expires_at && $promo->expires_at->isPast()) {
            return response()->json(['message' => 'Ce code promo a expiré.'], 422);
        }

        if ($promo->max_uses !== null && $promo->uses_count >= $promo->max_uses) {
            return response()->json(['message' => 'Ce code promo a atteint sa limite d\'utilisation.'], 422);
        }

        $promo->increment('uses_count');

        return response()->json([
            'message' => 'Code promo appliqué avec succès !',
            'promo' => [
                'id' => $promo->id,
                'code' => $promo->code,
                'type' => $promo->type,
                'discount' => $promo->discount,
            ],
        ]);
    }
}

