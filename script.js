/* =========================================================
   DAVIDS DIGITALS LTD.©
   WEBSITE JAVASCRIPT
   SUPABASE + ONLINE REVIEWS
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://skcycygpcfeseojcwsqo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_w1t5nhM3oBZx6jM3zQLisw_gL7pgNfS";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

let supabaseClient = null;

if (
    window.supabase &&
    SUPABASE_URL &&
    SUPABASE_KEY
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });


    const navLinks =
        navMenu.querySelectorAll("a");


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

        });

    });

}


/* =========================================================
   REVIEW MODAL
========================================================= */

const reviewBtn =
    document.getElementById("reviewBtn");

const reviewModal =
    document.getElementById("reviewModal");

const closeModal =
    document.getElementById("closeModal");


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


/* =========================================================
   CLOSE MODAL OUTSIDE
========================================================= */

if (reviewModal) {

    reviewModal.addEventListener("click", event => {

        if (event.target === reviewModal) {

            reviewModal.classList.remove("active");

        }

    });

}


/* =========================================================
   STAR RATING
========================================================= */

const ratingButtons =
    document.querySelectorAll(".rating-star");


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
   REVIEW ELEMENTS
========================================================= */

const reviewForm =
    document.getElementById("reviewForm");


const reviewsContainer =
    document.getElementById("reviewsContainer");


/* =========================================================
   DISPLAY REVIEWS
========================================================= */

async function displayReviews() {

    if (!reviewsContainer) {
        return;
    }


    if (!supabaseClient) {

        reviewsContainer.innerHTML = `

            <div class="review-empty">

                <div>⚠️</div>

                <p>
                    Reviews database is not connected.
                </p>

            </div>

        `;

        return;

    }


    reviewsContainer.innerHTML = `

        <div class="review-empty">

            <div>⏳</div>

            <p>
                Loading reviews...
            </p>

        </div>

    `;


    const { data, error } =
        await supabaseClient
            .from("reviews")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Error loading reviews:",
            error
        );


        reviewsContainer.innerHTML = `

            <div class="review-empty">

                <div>⚠️</div>

                <p>
                    Unable to load reviews right now.
                </p>

            </div>

        `;

        return;

    }


    if (!data || data.length === 0) {

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


    data.forEach(review => {

        const reviewCard =
            document.createElement("div");


        reviewCard.className =
            "service-card";


        const rating =
            Number(review.rating);


        const stars =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);


        const reviewDate =
            review.created_at
                ? new Date(
                    review.created_at
                ).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    }
                )
                : "";


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


            <h3>
                ${escapeHTML(review.name)}
            </h3>


            <p>
                "${escapeHTML(review.review)}"
            </p>


            <small
                style="
                    display:block;
                    margin-top:15px;
                    color:#64748b;
                "
            >
                ${reviewDate}
            </small>

        `;


        reviewsContainer.appendChild(
            reviewCard
        );

    });

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


/* =========================================================
   SUBMIT REVIEW
========================================================= */

if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!supabaseClient) {

                alert(
                    "The reviews database is not connected."
                );

                return;

            }


            const nameInput =
                document.getElementById(
                    "reviewName"
                );


            const textInput =
                document.getElementById(
                    "reviewText"
                );


            const name =
                nameInput.value.trim();


            const text =
                textInput.value.trim();


            if (!name || !text) {

                alert(
                    "Please fill in all fields."
                );

                return;

            }


            if (selectedRating === 0) {

                alert(
                    "Please select a star rating."
                );

                return;

            }


            if (name.length > 100) {

                alert(
                    "Name must be 100 characters or less."
                );

                return;

            }


            if (text.length > 1000) {

                alert(
                    "Review must be 1000 characters or less."
                );

                return;

            }


            const submitButton =
                reviewForm.querySelector(
                    ".submit-review"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

            }


            const { error } =
                await supabaseClient
                    .from("reviews")
                    .insert([
                        {
                            name: name,
                            review: text,
                            rating: selectedRating
                        }
                    ]);


            if (error) {

                console.error(
                    "Error submitting review:",
                    error
                );


                alert(
                    "We couldn't submit your review. Please try again."
                );


                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Submit Review";

                }

                return;

            }


            reviewForm.reset();


            selectedRating = 0;


            ratingButtons.forEach(star => {

                star.classList.remove(
                    "active"
                );

            });


            if (reviewModal) {

                reviewModal.classList.remove(
                    "active"
                );

            }


            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Submit Review";

            }


            await displayReviews();


            alert(
                "Thank you for reviewing DAVIDS DIGITALS LTD.©!"
            );

        }
    );

}


/* =========================================================
   REALTIME REVIEWS
========================================================= */

if (
    supabaseClient &&
    reviewsContainer
) {

    supabaseClient
        .channel("reviews-live")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "reviews"
            },
            () => {

                displayReviews();

            }
        )
        .subscribe();

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".service-card, .project-card, .activity-empty"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";


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

        element.style.opacity =
            "0";


        element.style.transform =
            "translateY(25px)";


        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";


        revealObserver.observe(
            element
        );

    });

}


/* =========================================================
   START WEBSITE
========================================================= */

displayReviews();