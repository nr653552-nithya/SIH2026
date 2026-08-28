/* =========================================================
   HERITAGE CONNECT
   SMART INDIA HACKATHON 2026
   JAVASCRIPT
========================================================= */


/* =========================================================
   WAIT FOR PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuBtn = document.getElementById("menuBtn");

    const navLinks = document.getElementById("navLinks");


    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("open");

        });

    }


    /* =====================================================
       SEARCH PANEL
    ===================================================== */

    const searchToggle =
        document.getElementById("searchToggle");

    const searchPanel =
        document.getElementById("searchPanel");


    if (searchToggle && searchPanel) {

        searchToggle.addEventListener("click", () => {

            searchPanel.classList.toggle("open");

            const input =
                document.getElementById("globalSearch");

            if (
                searchPanel.classList.contains("open") &&
                input
            ) {

                setTimeout(() => {
                    input.focus();
                }, 100);

            }

        });

    }


    /* =====================================================
       GLOBAL SEARCH
    ===================================================== */

    const globalSearch =
        document.getElementById("globalSearch");

    const globalSearchBtn =
        document.getElementById("globalSearchBtn");


    function performGlobalSearch() {

        if (!globalSearch) return;


        const query =
            globalSearch.value.trim();


        if (!query) {

            alert(
                "Please enter something to search."
            );

            return;

        }


        /*
           Demo search.

           Later we can connect this to a real
           heritage database / API.
        */

        const searchURL =
            "https://www.google.com/search?q=" +
            encodeURIComponent(
                query + " Indian heritage culture"
            );


        window.open(
            searchURL,
            "_blank"
        );

    }


    if (globalSearchBtn) {

        globalSearchBtn.addEventListener(
            "click",
            performGlobalSearch
        );

    }


    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    performGlobalSearch();

                }

            }
        );

    }


    /* =====================================================
       VOICE SEARCH
    ===================================================== */

    const voiceButtons =
        document.querySelectorAll(
            '[data-action="voice"]'
        );


    let recognition = null;


    /*
       Browser support check
    */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (SpeechRecognition) {

        recognition =
            new SpeechRecognition();

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.lang = "en-IN";


        recognition.onstart = () => {

            updateVoiceStatus(
                "🎙️ Listening..."
            );

        };


        recognition.onresult = event => {

            const text =
                event.results[0][0].transcript;


            updateVoiceStatus(
                "You said: " + text
            );


            const searchInput =
                document.getElementById(
                    "globalSearch"
                );


            if (searchInput) {

                searchInput.value = text;

            }


            const heritageInput =
                document.getElementById(
                    "heritageSearch"
                );


            if (heritageInput) {

                heritageInput.value = text;

            }


            /*
               Automatically perform search
            */

            if (searchInput) {

                performVoiceGoogleSearch(text);

            }

        };


        recognition.onerror = () => {

            updateVoiceStatus(
                "Voice recognition could not start. Please try again."
            );

        };


        recognition.onend = () => {

            setTimeout(() => {

                const status =
                    document.getElementById(
                        "voiceStatus"
                    );

                if (status) {

                    status.textContent =
                        "Tap the microphone to start.";

                }

            }, 3000);

        };

    }


    voiceButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!recognition) {

                    alert(
                        "Voice search is not supported in this browser. Please try Google Chrome."
                    );

                    return;

                }


                /*
                   Set language based on selected UI language
                */

                const lang =
                    document.getElementById(
                        "languageSelect"
                    );


                if (lang) {

                    recognition.lang =
                        getSpeechLanguage(
                            lang.value
                        );

                }


                recognition.start();

            }
        );

    });


    function updateVoiceStatus(message) {

        const status =
            document.getElementById(
                "voiceStatus"
            );


        if (status) {

            status.textContent =
                message;

        }

    }


    function performVoiceGoogleSearch(text) {

        if (!text) return;


        const url =
            "https://www.google.com/search?q=" +
            encodeURIComponent(
                text + " Indian heritage culture"
            );


        /*
           Delay slightly so user can see
           the recognized text.
        */

        setTimeout(() => {

            window.open(
                url,
                "_blank"
            );

        }, 700);

    }


    function getSpeechLanguage(language) {

        const languages = {

            en: "en-IN",

            ta: "ta-IN",

            hi: "hi-IN",

            te: "te-IN",

            kn: "kn-IN",

            ml: "ml-IN",

            bn: "bn-IN",

            sw: "sw-KE",

            fr: "fr-FR",

            ar: "ar-SA",

            zu: "zu-ZA"

        };


        return languages[language] || "en-IN";

    }


    /* =====================================================
       LANGUAGE SELECTOR
    ===================================================== */

    const languageSelect =
        document.getElementById(
            "languageSelect"
        );


    if (languageSelect) {

        languageSelect.addEventListener(
            "change",
            () => {

                const selected =
                    languageSelect.value;


                localStorage.setItem(
                    "heritageLanguage",
                    selected
                );


                showLanguageToast(
                    getLanguageMessage(
                        selected
                    )
                );

            }
        );


        /*
           Restore previous language
        */

        const savedLanguage =
            localStorage.getItem(
                "heritageLanguage"
            );


        if (
            savedLanguage &&
            languageSelect.querySelector(
                `option[value="${savedLanguage}"]`
            )
        ) {

            languageSelect.value =
                savedLanguage;

        }

    }


    function getLanguageMessage(language) {

        const messages = {

            en:
                "Language changed to English.",

            ta:
                "மொழி தமிழ் ஆக மாற்றப்பட்டது.",

            hi:
                "भाषा हिन्दी में बदल दी गई है।",

            te:
                "భాష తెలుగుకు మార్చబడింది.",

            kn:
                "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.",

            ml:
                "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി.",

            bn:
                "ভাষা বাংলায় পরিবর্তন করা হয়েছে।",

            sw:
                "Lugha imebadilishwa kuwa Kiswahili.",

            fr:
                "La langue a été changée en français.",

            ar:
                "تم تغيير اللغة إلى العربية.",

            zu:
                "Ulimi ushintshiwe waba isiZulu."

        };


        return messages[language] ||
               messages.en;

    }


    function showLanguageToast(message) {

        let toast =
            document.getElementById(
                "languageToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.id =
                "languageToast";


            toast.style.position =
                "fixed";

            toast.style.bottom =
                "25px";

            toast.style.right =
                "25px";

            toast.style.zIndex =
                "9999";

            toast.style.padding =
                "14px 18px";

            toast.style.borderRadius =
                "12px";

            toast.style.background =
                "#111936";

            toast.style.color =
                "white";

            toast.style.boxShadow =
                "0 15px 40px rgba(0,0,0,.2)";


            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        toast.style.display =
            "block";


        setTimeout(() => {

            toast.style.display =
                "none";

        }, 2500);

    }


    /* =====================================================
       HERITAGE SEARCH
    ===================================================== */

    const heritageSearch =
        document.getElementById(
            "heritageSearch"
        );


    const heritageSearchBtn =
        document.getElementById(
            "heritageSearchBtn"
        );


    if (
        heritageSearch &&
        heritageSearchBtn
    ) {

        heritageSearchBtn.addEventListener(
            "click",
            performHeritageSearch
        );


        heritageSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    performHeritageSearch();

                }

            }
        );

    }


    function performHeritageSearch() {

        const query =
            heritageSearch.value.trim();


        const results =
            document.getElementById(
                "searchResults"
            );


        if (!query) {

            if (results) {

                results.innerHTML =
                    "<p>Please enter a heritage topic.</p>";

            }

            return;

        }


        /*
           Demo local result cards.

           Later this can connect to a
           real cultural heritage database.
        */

        const cards = [

            {
                icon: "🏛️",
                title: query,
                text:
                    "Explore historical places and cultural stories related to your search."
            },

            {
                icon: "🎨",
                title: "Traditional Art & Crafts",
                text:
                    "Discover traditional artistic practices, artisans and handmade heritage."
            },

            {
                icon: "🪔",
                title: "Festivals & Traditions",
                text:
                    "Learn about festivals, rituals and cultural traditions."
            }

        ];


        if (results) {

            results.innerHTML =
                cards.map(card => `

                    <article class="result-card">

                        <div style="font-size:32px;">
                            ${card.icon}
                        </div>

                        <h3>
                            ${card.title}
                        </h3>

                        <p>
                            ${card.text}
                        </p>

                    </article>

                `).join("");

        }

    }


    /* =====================================================
       SCANNER
    ===================================================== */

    const startScanner =
        document.getElementById(
            "startScanner"
        );


    const stopScanner =
        document.getElementById(
            "stopScanner"
        );


    const scannerVideo =
        document.getElementById(
            "scannerVideo"
        );


    const scannerStatus =
        document.getElementById(
            "scannerStatus"
        );


    let scannerStream =
        null;


    let barcodeDetector =
        null;


    if (
        "BarcodeDetector" in window
    ) {

        try {

            barcodeDetector =
                new BarcodeDetector({

                    formats: [
                        "qr_code",
                        "code_128",
                        "code_39",
                        "ean_13",
                        "ean_8",
                        "upc_a",
                        "upc_e"
                    ]

                });

        } catch (error) {

            barcodeDetector = null;

        }

    }


    if (startScanner) {

        startScanner.addEventListener(
            "click",
            startCamera
        );

    }


    if (stopScanner) {

        stopScanner.addEventListener(
            "click",
            stopCamera
        );

    }


    async function startCamera() {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            alert(
                "Camera access is not supported by this browser."
            );

            return;

        }


        try {

            scannerStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio: false

                });


            if (scannerVideo) {

                scannerVideo.srcObject =
                    scannerStream;

            }


            if (scannerStatus) {

                scannerStatus.textContent =
                    "📷 Camera active — point it at a QR code.";

            }


            if (barcodeDetector) {

                scanBarcode();

            } else {

                if (scannerStatus) {

                    scannerStatus.textContent =
                        "Camera is active. QR detection depends on browser support.";

                }

            }

        } catch (error) {

            console.error(error);


            if (scannerStatus) {

                scannerStatus.textContent =
                    "Camera permission was denied or unavailable.";

            }

        }

    }


    async function scanBarcode() {

        if (
            !scannerStream ||
            !barcodeDetector ||
            !scannerVideo
        ) {

            return;

        }


        try {

            const codes =
                await barcodeDetector.detect(
                    scannerVideo
                );


            if (codes.length > 0) {

                const value =
                    codes[0].rawValue;


                if (scannerStatus) {

                    scannerStatus.textContent =
                        "✅ Scanned: " + value;

                }


                /*
                   If QR contains a URL,
                   open it.
                */

                if (
                    value.startsWith("http://") ||
                    value.startsWith("https://")
                ) {

                    setTimeout(() => {

                        window.open(
                            value,
                            "_blank"
                        );

                    }, 800);

                }


                stopCamera();

                return;

            }

        } catch (error) {

            /*
               Ignore detection errors while
               camera is running.
            */

        }


        requestAnimationFrame(
            scanBarcode
        );

    }


    function stopCamera() {

        if (scannerStream) {

            scannerStream
                .getTracks()
                .forEach(track => {
                    track.stop();
                });

            scannerStream = null;

        }


        if (scannerVideo) {

            scannerVideo.srcObject =
                null;

        }


        if (scannerStatus) {

            scannerStatus.textContent =
                "Scanner is ready.";

        }

    }


    /* =====================================================
       LOCATION
    ===================================================== */

    const locationBtn =
        document.getElementById(
            "locationBtn"
        );


    const locationStatus =
        document.getElementById(
            "locationStatus"
        );


    if (locationBtn) {

        locationBtn.addEventListener(
            "click",
            getLocation
        );

    }


    function getLocation() {

        if (!navigator.geolocation) {

            if (locationStatus) {

                locationStatus.textContent =
                    "Location is not supported by your browser.";

            }

            return;

        }


        if (locationStatus) {

            locationStatus.textContent =
                "📍 Detecting your location...";

        }


        navigator.geolocation.getCurrentPosition(

            position => {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                if (locationStatus) {

                    locationStatus.innerHTML = `

                        📍 Location detected.

                        <br>

                        <small>
                            Latitude: ${lat.toFixed(5)}
                            <br>
                            Longitude: ${lng.toFixed(5)}
                        </small>

                    `;

                }


                /*
                   Open Google Maps near
                   current coordinates.
                */

                const mapsURL =
                    `https://www.google.com/maps/search/heritage+sites/@${lat},${lng},13z`;


                const openMap =
                    document.createElement(
                        "a"
                    );


                openMap.href =
                    mapsURL;

                openMap.target =
                    "_blank";

                openMap.rel =
                    "noopener";

                openMap.className =
                    "btn primary";

                openMap.style.marginTop =
                    "15px";

                openMap.textContent =
                    "🗺️ Explore Heritage Near Me";


                if (locationStatus) {

                    locationStatus
                        .parentElement
                        .appendChild(
                            openMap
                        );

                }

            },

            error => {

                let message =
                    "Unable to detect location.";

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {

                    message =
                        "Location permission was denied. Please allow location access.";

                }


                if (locationStatus) {

                    locationStatus.textContent =
                        "📍 " + message;

                }

            },

            {

                enableHighAccuracy: false,

                timeout: 10000,

                maximumAge: 60000

            }

        );

    }


    /* =====================================================
       LANGUAGE DEMO BUTTONS
    ===================================================== */

    const demoLanguages =
        document.querySelectorAll(
            "[data-demo-lang]"
        );


    demoLanguages.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const language =
                    button.dataset.demoLang;


                const message =
                    document.getElementById(
                        "languageMessage"
                    );


                if (message) {

                    message.textContent =
                        "🌐 Selected language: " +
                        language;

                }

            }
        );

    });


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "name"
                    ).value.trim();


                const formMessage =
                    document.getElementById(
                        "formMessage"
                    );


                if (formMessage) {

                    formMessage.textContent =
                        `Thank you ${name}! Your message has been received in this demo.`;

                }


                contactForm.reset();

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU AFTER LINK CLICK
    ===================================================== */

    document
        .querySelectorAll(".navlinks a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (navLinks) {

                        navLinks.classList.remove(
                            "open"
                        );

                    }

                }
            );

        });


});