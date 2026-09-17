/* =========================================================
DAVIDS DIGITALS LTD.©
WEBSITE JAVASCRIPT
========================================================= */

/* =========================================================
MOBILE NAVIGATION
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

const navLinks = navMenu.querySelectorAll("a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });

});

}

/* =========================================================
REVIEW MODAL
========================================================= */

const reviewBtn = document.getElementById("reviewBtn");
const reviewModal = document.getElementById("reviewModal");
const closeModal = document.getElementById("closeModal");

if (reviewBtn && reviewModal) {

reviewBtn.addEventListener("click", () => {
    reviewModal.classList.add("active");
});

}

if (closeModal && reviewModal) {

closeModal.addEventListener("click", () => {
    reviewModal.classList.remove("active");
});

}

/* Close modal when clicking outside */

if (reviewModal) {

reviewModal.addEventListener("click", (event) => {

    if (event.target === reviewModal) {
        reviewModal.classList.remove("active");
    }

});

}

/* =========================================================
STAR RATING
========================================================= */

const ratingButtons =
document.querySelectorAll(".rating button");

let selectedRating = 0;

ratingButtons.forEach(button => {

button.addEventListener("click", () => {

    selectedRating =
        Number(button.dataset.rating);

    ratingButtons.forEach(star => {

        const starRating =
            Number(star.dataset.rating);

        if (starRating <= selectedRating) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }

    });

});

});

/* =========================================================
REVIEW STORAGE
========================================================= */

const reviewForm =
document.getElementById("reviewForm");

const reviewsContainer =
document.getElementById("reviewsContainer");

function getReviews() {

const savedReviews =
    localStorage.getItem("davidsDigitalsReviews");

if (!savedReviews) {
    return [];
}

try {

    return JSON.parse(savedReviews);

} catch (error) {

    return [];

}

}

function saveReviews(reviews) {

localStorage.setItem(
    "davidsDigitalsReviews",
    JSON.stringify(reviews)
);

}

/* =========================================================
DISPLAY REVIEWS
========================================================= */

function displayReviews() {

if (!reviewsContainer) {
    return;
}

const reviews = getReviews();

if (reviews.length === 0) {

    reviewsContainer.innerHTML = `
        <div class="review-empty">

            <div>⭐</div>

            <p>
                Be one of the first people to review
                DAVIDS DIGITALS LTD.©
            </p>

        </div>
    `;

    return;
}


reviewsContainer.innerHTML = "";


reviews.forEach(review => {

    const reviewCard =
        document.createElement("div");

    reviewCard.className = "service-card";


    const stars =
        "★".repeat(review.rating) +
        "☆".repeat(5 - review.rating);


    reviewCard.innerHTML = `

        <div
            style="
                color:#facc15;
                font-size:18px;
                margin-bottom:12px;
            "
        >
            ${stars}
        </div>

        <h3>${escapeHTML(review.name)}</h3>

        <p>
            "${escapeHTML(review.text)}"
        </p>

        <small
            style="
                display:block;
                margin-top:15px;
                color:#64748b;
            "
        >
            ${review.date}
        </small>

    `;


    reviewsContainer.appendChild(reviewCard);

});

}

/* =========================================================
SECURITY HELPER
========================================================= */

function escapeHTML(text) {

const div =
    document.createElement("div");

div.textContent = text;

return div.innerHTML;

}

/* =========================================================
SUBMIT REVIEW
========================================================= */

if (reviewForm) {

reviewForm.addEventListener("submit", event => {

    event.preventDefault();


    const name =
        document
            .getElementById("reviewName")
            .value
            .trim();


    const text =
        document
            .getElementById("reviewText")
            .value
            .trim();


    if (!name || !text) {

        alert("Please fill in all fields.");

        return;

    }


    if (selectedRating === 0) {

        alert("Please select a star rating.");

        return;

    }


    const review = {

        name: name,

        text: text,

        rating: selectedRating,

        date: new Date()
            .toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            )

    };


    const reviews =
        getReviews();


    reviews.unshift(review);


    saveReviews(reviews);


    reviewForm.reset();


    selectedRating = 0;


    ratingButtons.forEach(star => {
        star.classList.remove("active");
    });


    reviewModal.classList.remove("active");


    displayReviews();


    alert(
        "Thank you for reviewing DAVIDS DIGITALS LTD.©!"
    );

});

}

/* =========================================================
SCROLL REVEAL
========================================================= */

const revealElements =
document.querySelectorAll(
".service-card, .project-card, .activity-empty"
);

const revealObserver =
new IntersectionObserver(
entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {

element.style.opacity = "0";

element.style.transform =
    "translateY(25px)";

element.style.transition =
    "opacity 0.7s ease, transform 0.7s ease";

revealObserver.observe(element);

});

/* =========================================================
START WEBSITE
========================================================= */

displayReviews();