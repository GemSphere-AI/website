function sendEmail() {
    let templateParams = {
        name: document.getElementById("name").value,
        subject: document.getElementById("subject").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };
    emailjs.send("service_a5cb7qb", "template_72wwy9a", templateParams)
        .then(alert("Email sent successfully!"), function(error) {
            console.log("FAILED...", error);
        });
}