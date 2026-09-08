/* ============================================================
   PATHFINDER - USER CAREER PROFILE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("======================================");
    console.log("Profile JS Loaded");
    console.log("======================================");


    // ============================================================
    // USER DATA
    // ============================================================

    const userId =
        localStorage.getItem("userId");

    const userName =
        localStorage.getItem("name");

    const userEmail =
        localStorage.getItem("email");

    const token =
        (typeof getAuthToken === "function") ? getAuthToken() : (
            localStorage.getItem("token") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("accessToken")
        );


    console.log("User ID:", userId);
    console.log("User Name:", userName);
    console.log("User Email:", userEmail);
    console.log(
        "Token:",
        token ? "Available" : "Not Available"
    );


    // ============================================================
    // PROFILE API
    // ============================================================

    var API_BASE_URL =
        (typeof getApiBaseUrl === "function")
            ? getApiBaseUrl()
            : (window.API_BASE_URL || "http://localhost:8090/api");

    var PROFILE_API =
        (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.PROFILE)
            ? API_ENDPOINTS.PROFILE.BASE
            : API_BASE_URL + "/profile";


    // ============================================================
    // ELEMENTS
    // ============================================================

    const education =
        document.getElementById("education");

    const college =
        document.getElementById("college");

    const graduationYear =
        document.getElementById("graduationYear");

    const technicalSkills =
        document.getElementById("technicalSkills");

    const interests =
        document.getElementById("interests");

    const experienceLevel =
        document.getElementById("experienceLevel");

    /*
     * careerGoal is NOT present in your current JSP.
     *
     * Therefore we do NOT make it mandatory.
     *
     * If you add careerGoal later, this JS will automatically
     * use it.
     */
    const careerGoal =
        document.getElementById("careerGoal");

    const saveProfileBtn =
        document.getElementById("saveProfileBtn");

    const resetProfileBtn =
        document.getElementById("resetProfileBtn");

    const profileMessage =
        document.getElementById("profileMessage");


    // ============================================================
    // CHECK REQUIRED ELEMENTS
    // ============================================================

    if (
        !education ||
        !college ||
        !graduationYear ||
        !technicalSkills ||
        !interests ||
        !experienceLevel ||
        !saveProfileBtn ||
        !resetProfileBtn
    ) {

        console.error(
            "Profile form elements not found."
        );

        console.error({
            education: !!education,
            college: !!college,
            graduationYear: !!graduationYear,
            technicalSkills: !!technicalSkills,
            interests: !!interests,
            experienceLevel: !!experienceLevel,
            careerGoal: !!careerGoal,
            saveProfileBtn: !!saveProfileBtn,
            resetProfileBtn: !!resetProfileBtn
        });

        return;
    }


    console.log(
        "All required profile elements found."
    );


    // ============================================================
    // PROFILE STATE
    // ============================================================

    let profileExists = false;

    let existingProfile = null;


    // ============================================================
    // AUTH HEADERS
    // ============================================================

    function getHeaders() {

        const headers = {
            "Content-Type": "application/json"
        };

        if (token) {

            headers["Authorization"] =
                "Bearer " + token;
        }

        return headers;
    }


    // ============================================================
    // GET PROFILE VALUE
    //
    // Supports:
    //
    // graduationYear
    // graduation_year
    //
    // technicalSkills
    // technical_skills
    // ============================================================

    function getValue(
        object,
        camelCaseName,
        snakeCaseName
    ) {

        if (!object) {
            return "";
        }

        if (
            object[camelCaseName] !== undefined &&
            object[camelCaseName] !== null
        ) {

            return object[camelCaseName];
        }

        if (
            object[snakeCaseName] !== undefined &&
            object[snakeCaseName] !== null
        ) {

            return object[snakeCaseName];
        }

        return "";
    }


    // ============================================================
    // LOAD PROFILE
    //
    // GET /profile
    // ============================================================

    function loadProfile() {

        console.log("======================================");
        console.log("Loading profile...");
        console.log("GET:", PROFILE_API);
        console.log("======================================");


        if (!token) {

            console.warn(
                "JWT token not found."
            );

            showAlert(
                "warning",
                "Login Required",
                "Please login before accessing your profile."
            );

            return;
        }


        fetch(
            PROFILE_API,
            {
                method: "GET",
                headers: getHeaders()
            }
        )

        .then(function (response) {

            console.log(
                "Profile response status:",
                response.status
            );


            // ====================================================
            // PROFILE NOT FOUND
            // ====================================================

            if (response.status === 404) {

                console.log(
                    "Profile does not exist."
                );

                profileExists = false;

                existingProfile = null;

                clearProfileForm();

                setSaveMode();

                return null;
            }


            // ====================================================
            // UNAUTHORIZED
            // ====================================================

            if (response.status === 401) {

                throw new Error(
                    "Unauthorized. JWT may be invalid or expired."
                );
            }


            // ====================================================
            // FORBIDDEN
            // ====================================================

            if (response.status === 403) {

                throw new Error(
                    "You are not authorized to access this profile."
                );
            }


            // ====================================================
            // OTHER ERROR
            // ====================================================

            if (!response.ok) {

                throw new Error(
                    "Profile API error: HTTP " +
                    response.status
                );
            }


            return response.json();
        })

        .then(function (profile) {

            if (!profile) {
                return;
            }


            console.log("======================================");
            console.log("PROFILE DATA FROM BACKEND");
            console.log(profile);
            console.log("======================================");


            profileExists = true;

            existingProfile = profile;


            fillProfile(profile);

            setUpdateMode();


            console.log(
                "Profile loaded successfully."
            );
        })

        .catch(function (error) {

            console.error(
                "Profile loading error:",
                error
            );


            showAlert(
                "error",
                "Unable to Load Profile",
                error.message
            );
        });
    }


    // ============================================================
    // FILL PROFILE
    // ============================================================

    function fillProfile(profile) {

        education.value =
            getValue(
                profile,
                "education",
                "education"
            ) || "";


        college.value =
            getValue(
                profile,
                "college",
                "college"
            ) || "";


        graduationYear.value =
            getValue(
                profile,
                "graduationYear",
                "graduation_year"
            ) || "";


        technicalSkills.value =
            getValue(
                profile,
                "technicalSkills",
                "technical_skills"
            ) || "";


        interests.value =
            getValue(
                profile,
                "interests",
                "interests"
            ) || "";


        experienceLevel.value =
            getValue(
                profile,
                "experienceLevel",
                "experience_level"
            ) || "";


        /*
         * careerGoal is optional because it does not currently
         * exist in your JSP.
         */

        if (careerGoal) {

            careerGoal.value =
                getValue(
                    profile,
                    "careerGoal",
                    "career_goal"
                ) || "";
        }


        console.log(
            "Profile form populated."
        );
    }


    // ============================================================
    // CLEAR PROFILE
    // ============================================================

    function clearProfileForm() {

        education.value = "";

        college.value = "";

        graduationYear.value = "";

        technicalSkills.value = "";

        interests.value = "";

        experienceLevel.value = "";

        if (careerGoal) {

            careerGoal.value = "";
        }

        if (profileMessage) {

            profileMessage.innerHTML = "";
        }
    }


    // ============================================================
    // SAVE MODE
    // ============================================================

    function setSaveMode() {

        saveProfileBtn.innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i> Save Profile';
    }


    // ============================================================
    // UPDATE MODE
    // ============================================================

    function setUpdateMode() {

        saveProfileBtn.innerHTML =
            '<i class="fa-solid fa-pen-to-square"></i> Update Profile';
    }


    // ============================================================
    // GET FORM DATA
    // ============================================================

    function getProfileData() {

        const data = {

            education:
                education.value.trim(),

            college:
                college.value.trim(),

            graduationYear:
                graduationYear.value
                    ? Number(graduationYear.value)
                    : null,

            technicalSkills:
                technicalSkills.value.trim(),

            interests:
                interests.value.trim(),

            experienceLevel:
                experienceLevel.value
        };


        /*
         * Only add careerGoal if the element exists.
         */

        if (careerGoal) {

            data.careerGoal =
                careerGoal.value;
        }


        return data;
    }


    // ============================================================
    // VALIDATION
    // ============================================================

    function validateProfile(data) {


        // ========================================================
        // EDUCATION
        // ========================================================

        if (!data.education) {

            showAlert(
                "warning",
                "Education Required",
                "Please enter your education."
            );

            education.focus();

            return false;
        }


        // ========================================================
        // COLLEGE
        // ========================================================

        if (!data.college) {

            showAlert(
                "warning",
                "College Required",
                "Please enter your college or university."
            );

            college.focus();

            return false;
        }


        // ========================================================
        // GRADUATION YEAR
        // ========================================================

        if (!data.graduationYear) {

            showAlert(
                "warning",
                "Graduation Year Required",
                "Please enter your graduation year."
            );

            graduationYear.focus();

            return false;
        }


        if (
            data.graduationYear < 1990 ||
            data.graduationYear > 2100
        ) {

            showAlert(
                "warning",
                "Invalid Graduation Year",
                "Please enter a valid graduation year."
            );

            graduationYear.focus();

            return false;
        }


        // ========================================================
        // TECHNICAL SKILLS
        // ========================================================

        if (!data.technicalSkills) {

            showAlert(
                "warning",
                "Technical Skills Required",
                "Please enter your technical skills."
            );

            technicalSkills.focus();

            return false;
        }


        // ========================================================
        // INTERESTS
        // ========================================================

        if (!data.interests) {

            showAlert(
                "warning",
                "Interests Required",
                "Please enter your interests."
            );

            interests.focus();

            return false;
        }


        // ========================================================
        // EXPERIENCE
        // ========================================================

        if (!data.experienceLevel) {

            showAlert(
                "warning",
                "Experience Level Required",
                "Please select your experience level."
            );

            experienceLevel.focus();

            return false;
        }


        // ========================================================
        // CAREER GOAL
        //
        // Only validate if the field exists.
        // ========================================================

        if (
            careerGoal &&
            !data.careerGoal
        ) {

            showAlert(
                "warning",
                "Career Goal Required",
                "Please select your career goal."
            );

            careerGoal.focus();

            return false;
        }


        return true;
    }


    // ============================================================
    // SAVE PROFILE
    //
    // POST /profile/save
    // ============================================================

    function saveProfile() {

        const data =
            getProfileData();


        console.log(
            "Profile data to save:",
            data
        );


        if (!validateProfile(data)) {
            return;
        }


        saveProfileBtn.disabled = true;


        fetch(
            PROFILE_API + "/save",
            {
                method: "POST",

                headers: getHeaders(),

                body: JSON.stringify(data)
            }
        )

        .then(function (response) {

            console.log(
                "Save response:",
                response.status
            );


            return response.text()
                .then(function (message) {

                    return {

                        ok: response.ok,

                        status:
                            response.status,

                        message:
                            message
                    };
                });
        })

        .then(function (result) {

            console.log(
                "Save result:",
                result
            );


            // ====================================================
            // SUCCESS
            // ====================================================

            if (result.ok) {

                profileExists = true;

                /*
                 * Keep a copy of current form values.
                 */
                existingProfile =
                    getProfileData();


                setUpdateMode();


                if (profileMessage) {

                    profileMessage.innerHTML =
                        '<i class="fa-solid fa-circle-check"></i> ' +
                        'Profile saved successfully.';
                }


                showAlert(
                    "success",
                    "Profile Saved!",
                    "Your career profile has been saved successfully."
                );

                return;
            }


            // ====================================================
            // PROFILE ALREADY EXISTS
            // ====================================================

            if (result.status === 400) {

                showAlert(
                    "info",
                    "Profile Already Exists",
                    result.message ||
                    "Profile already exists for this user."
                );


                /*
                 * Load existing profile.
                 */
                loadProfile();

                return;
            }


            throw new Error(
                result.message ||
                "Unable to save profile."
            );
        })

        .catch(function (error) {

            console.error(
                "Save error:",
                error
            );


            showAlert(
                "error",
                "Save Failed",
                error.message
            );
        })

        .finally(function () {

            saveProfileBtn.disabled = false;
        });
    }


    // ============================================================
    // UPDATE PROFILE
    //
    // PUT /profile/update
    // ============================================================

    function updateProfile() {

        const data =
            getProfileData();


        console.log(
            "Profile data to update:",
            data
        );


        if (!validateProfile(data)) {
            return;
        }


        saveProfileBtn.disabled = true;


        fetch(
            PROFILE_API + "/update",
            {
                method: "PUT",

                headers: getHeaders(),

                body: JSON.stringify(data)
            }
        )

        .then(function (response) {

            console.log(
                "Update response:",
                response.status
            );


            return response.text()
                .then(function (message) {

                    return {

                        ok: response.ok,

                        status:
                            response.status,

                        message:
                            message
                    };
                });
        })

        .then(function (result) {

            console.log(
                "Update result:",
                result
            );


            // ====================================================
            // SUCCESS
            // ====================================================

            if (result.ok) {

                existingProfile =
                    getProfileData();


                profileExists = true;


                setUpdateMode();


                if (profileMessage) {

                    profileMessage.innerHTML =
                        '<i class="fa-solid fa-circle-check"></i> ' +
                        'Profile updated successfully.';
                }


                showAlert(
                    "success",
                    "Profile Updated!",
                    "Your career profile has been updated successfully."
                );

                return;
            }


            throw new Error(
                result.message ||
                "Unable to update profile."
            );
        })

        .catch(function (error) {

            console.error(
                "Update error:",
                error
            );


            showAlert(
                "error",
                "Update Failed",
                error.message
            );
        })

        .finally(function () {

            saveProfileBtn.disabled = false;
        });
    }


    // ============================================================
    // SAVE / UPDATE BUTTON
    // ============================================================

    saveProfileBtn.addEventListener(
        "click",
        function () {

            console.log(
                "Save/Update button clicked."
            );


            if (profileExists) {

                updateProfile();

            } else {

                saveProfile();
            }
        }
    );


    // ============================================================
    // RESET BUTTON
    // ============================================================

    resetProfileBtn.addEventListener(
        "click",
        function () {

            console.log(
                "Reset button clicked."
            );


            // ====================================================
            // EXISTING PROFILE
            // ====================================================

            if (
                profileExists &&
                existingProfile
            ) {

                fillProfile(
                    existingProfile
                );


                if (profileMessage) {

                    profileMessage.innerHTML = "";
                }


                showAlert(
                    "success",
                    "Reset Complete",
                    "Your unsaved changes have been removed.",
                    1500
                );


                return;
            }


            // ====================================================
            // NEW PROFILE
            // ====================================================

            clearProfileForm();


            showAlert(
                "success",
                "Form Reset",
                "All profile fields have been cleared.",
                1500
            );
        }
    );


    // ============================================================
    // SWEET ALERT HELPER
    // ============================================================

    function showAlert(
        icon,
        title,
        text,
        timer
    ) {

        /*
         * If SweetAlert is loaded.
         */

        if (
            typeof Swal !== "undefined"
        ) {

            const options = {

                icon: icon,

                title: title,

                text: text,

                confirmButtonText: "OK"
            };


            if (timer) {

                options.timer = timer;

                options.showConfirmButton = false;
            }


            Swal.fire(options);

            return;
        }


        /*
         * Fallback if SweetAlert is unavailable.
         */

        console.log(
            title + ": " + text
        );
    }


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    loadProfile();


    // ============================================================
    // FINAL LOG
    // ============================================================

    console.log(
        "Profile JS initialized successfully."
    );

});