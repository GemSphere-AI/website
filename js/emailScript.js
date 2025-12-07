// Close success bubble
function closeSuccessBubble() {
    const bubble = document.getElementById('success-bubble');
    if (bubble) {
        bubble.classList.add('d-none');
    }
}

function sendEmail() {
    let name = document.getElementById("name");
    let subject = document.getElementById("subject");
    let email = document.getElementById("email");
    let message = document.getElementById("message");

    let templateParams = {
        name: name.value,
        subject: subject.value,
        email: email.value,
        message: message.value
    };

    emailjs.send("service_a5cb7qb", "template_72wwy9a", templateParams)
        .then(function () {
            // Show local success message
            const successDiv = document.getElementById('email-success');
            if (successDiv) {
                successDiv.classList.remove('d-none');

                // Clear form fields
                name.value = "";
                subject.value = "";
                email.value = "";
                message.value = "";

                // Auto hide after 5 seconds
                setTimeout(() => {
                    successDiv.classList.add('d-none');
                }, 5000);
            } else {
                alert("Thank you for contacting GemSphere.ai. We have received your message and will get back to you shortly !");
                // Clear form fields even if alert is used
                name.value = "";
                subject.value = "";
                email.value = "";
                message.value = "";
            }
        }, function (error) {
            console.log("FAILED...", error);
            alert("Failed to send message. Please try again later.");
        });
}