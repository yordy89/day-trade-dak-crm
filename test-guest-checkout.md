# Testing Guest Checkout

## Master Course Guest Checkout Test

1. **Navigate to Master Course page** (while not logged in)
   - URL: `/master-course`
   - Should see the course details and pricing

2. **Click "REGÍSTRATE AHORA" button**
   - Should open registration modal WITHOUT redirecting to login
   - Should see form fields:
     - First Name (required)
     - Last Name (required)
     - Email (required)
     - Phone Number (optional)
     - Trading Experience (optional)
     - Expectations (optional)

3. **Fill the form and submit**
   - Should proceed to Stripe checkout
   - Should see the course price
   - Should be able to complete payment as guest

## Community Event Subscription Validation Test

1. **Navigate to Community Event page** (while not logged in)
   - URL: `/community-event`
   - Should see event details

2. **Click "REGÍSTRATE AHORA" button**
   - Should see confirmation dialog: "Este evento es exclusivo para miembros con suscripción Live Semanal. ¿Deseas iniciar sesión para verificar tu suscripción?"
   - Options: OK (login) or Cancel (view plans)

3. **Test with logged in user WITHOUT subscription**
   - Should see: "Este evento requiere una suscripción activa de Live Semanal o Live Semanal Auto. ¿Deseas ver los planes disponibles?"

4. **Test with logged in user with Basic/Class/Mentorship subscription**
   - Should see: "Tu suscripción actual no incluye acceso a eventos comunitarios. Necesitas actualizar a Live Semanal o Live Semanal Auto. ¿Deseas ver las opciones de actualización?"

5. **Test with logged in user with Live Semanal subscription**
   - Should open registration modal directly
   - Should be able to complete registration

## API Endpoint Test

Test the public event-checkout endpoint:

```bash
curl -X POST http://localhost:3008/api/v1/payments/event-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "master-course-event-id",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phoneNumber": "+1234567890",
    "additionalInfo": {
      "tradingExperience": "Beginner",
      "expectations": "Learn trading"
    }
  }'
```

Should return:
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_..."
}
```

## Expected Behavior Summary

### Master Course:
- ✅ Guest checkout allowed
- ✅ No login required
- ✅ Direct to payment after form

### Community Event:
- ✅ Login required
- ✅ Live Semanal subscription required
- ✅ Clear messaging for different user states
- ✅ Upgrade path for existing subscribers