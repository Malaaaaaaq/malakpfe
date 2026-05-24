<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px; margin: 0 auto; }
        .header { color: #041562; font-size: 24px; font-weight: bold; text-align: center; }
        .promo-code { background: #041562; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
        .discount { text-align: center; font-size: 28px; color: #10b981; font-weight: bold; margin: 15px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">🎉 Offre Spéciale ParLak</div>
        <p>Bonjour,</p>
        <p>Un nouveau code promo vient d'être activé rien que pour vous ! Utilisez-le lors de votre prochaine réservation de parking.</p>

        <div class="discount">
            @if ($type === 'percent')
                -{{ $discount }}%
            @else
                -{{ number_format($discount, 2) }} MAD
            @endif
        </div>

        <div class="promo-code">{{ $code }}</div>

        @if ($expiresAt)
            <p style="text-align: center; color: #ef4444;">Offre valable jusqu'au {{ $expiresAt }}</p>
        @endif

        <p style="text-align: center;">Rendez-vous sur ParLak et réservez votre place dès maintenant !</p>
        <br>
        <p>Cordialement,<br>L'équipe ParLak</p>
        <div class="footer">
            <p>© {{ date('Y') }} ParLak. Tous droits réservés.</p>
            <p>Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
        </div>
    </div>
</body>
</html>
