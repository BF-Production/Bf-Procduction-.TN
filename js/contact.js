function initContact() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('serviceType').value;
      const message = document.getElementById('message').value;

      // Replace with your actual WhatsApp phone number
      const whatsappNumber = "21622028028"; // Example: "1234567890" for international format without '+' or '00'

      const text = `*NEW EVENT PRODUCTION INQUIRY*\n` +
             `*Agency:* BF Production\n\n` +
             `• *Client:* ${name}\n` +
             `• *Phone:* ${phone}\n` +
             `• *Requested Package:* ${service}\n\n` +
             `*Event Notes:*\n` +
             `"${message}"\n\n` +
             `_FEEL THE LIGHT • TRUST THE SOUND_`;

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }
}