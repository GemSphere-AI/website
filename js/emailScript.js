function sendEmail() {
    let templateParams = {
        name: document.getElementById("name").value,
        subject: document.getElementById("subject").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };
    emailjs.send("service_a5cb7qb", "template_72wwy9a", templateParams)
        .then(alert("Thank you for contacting GemSphere.ai. We have received your message and will get back to you shortly !"), function(error) {
            console.log("FAILED...", error);
        });
}