<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PromoCodeEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $code;
    public $discount;
    public $type;
    public $expiresAt;

    public function __construct($code, $discount, $type, $expiresAt = null)
    {
        $this->code = $code;
        $this->discount = $discount;
        $this->type = $type;
        $this->expiresAt = $expiresAt;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 Votre code promo ParLak est disponible !',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.promo_code',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
