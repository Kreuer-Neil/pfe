<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #222; line-height: 1.5;">
    <h2>New {{ $contactSubject->value }} message</h2>
    <p><strong>From:</strong> {{ $name }} ({{ $email }})</p>
    <p style="white-space: pre-line;">{{ $messageBody }}</p>
</body>
</html>
