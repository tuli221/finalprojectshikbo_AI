<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Booking Confirmed</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; color: #111827; }
      .container { max-width: 600px; margin: 0 auto; padding: 24px; }
      .header { text-align: center; padding: 12px 0; }
      .card { background: #0f172a; color: #fff; padding: 24px; border-radius: 8px; }
      .muted { color: #9ca3af; }
      .field { margin-bottom: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Booking Confirmed</h2>
      </div>

      <div class="card">
        <p class="muted">Hello {{ $booking->name }},</p>
        <p>You're officially registered for <strong>{{ $booking->program->title ?? 'the program' }}</strong>!</p>

        <div class="field">
          <strong>Topic:</strong><br>
          {{ $booking->program->title ?? '-' }}
        </div>

        <div class="field">
          <strong>Date / Time:</strong><br>
          {{ $booking->slot_label ?? 'To be confirmed' }}
        </div>

        <div class="field">
          <strong>Location:</strong><br>
          Sector 10, Uttara Model Town<br>
          Flat-3A, House 73/F, Road 12/B, Dhaka-1230, Bangladesh.
        </div>

        <div class="field">
          <strong>Attendee:</strong><br>
          {{ $booking->name }} ({{ $booking->email }}, {{ $booking->phone }})
        </div>

        <p class="muted">Bring your energy and enthusiasm — we'll see you there!</p>
      </div>
    </div>
  </body>
</html>
