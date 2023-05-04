// Grab all HTML Elements

// All containers
const feedback = document.getElementById("feedbacktext");
const wholeContainer = document.querySelector(".feedback");
const resultContainer = document.querySelector(".results");

// All controls
const submit_button = document.getElementById("submit");
const closeButton = document.querySelector(".close");

// Results
const emoji = document.querySelector(".emoji");
const sentiment = document.querySelector(".sentiment");

// Add event listener to submit button, send feedback and
// name to our node js server application
submit_button.addEventListener("click",()=>{
	console.log("Feedback: ",feedback.value);

	// Send POST request to our server
	const options = {
		method : "POST",
		body : JSON.stringify({
			feedback : feedback.value
		}),
		headers : new Headers({
			'Content-Type' : "application/json"
		})
	}

	// Use fetch to request server
	fetch("/feedback",options)
		.then(res=>res.json())
		.then((response)=>{

            const tale_category = response.tale_category;
			sentiment.innerHTML = "<p>Tespit edilen masal kategorisi: <strong>"+  tale_category +"</strong> </p>";

			// Result Box should appear
			resultContainer.classList.add("active");
			wholeContainer.classList.add("active");

		})
		.catch(err=>console.error("Error: ",err));

	// Clear all inputs after operation
	feedback.value = "";
});

// Close Button

closeButton.addEventListener("click",()=>{
	wholeContainer.classList.remove("active");
	resultContainer.classList.remove("active");
})
