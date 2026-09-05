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

        const searchURL =
            "https://www.google.com/search?q=" +
            encodeURIComponent(
                query + " Indian heritage culture"
            );

        window.open(
            searchURL,
            "_blank",
            "noopener,noreferrer"
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
       FIXED FOR GITHUB PAGES
       ===================================================== */

    const voiceButtons =
        document.querySelectorAll(
            '[data-action="voice"], #voiceButton'
        );

    let recognition = null;
    let voiceSearchWindow = null;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    /*
       Browser support
    */

    if (SpeechRecognition) {

        try {

            recognition =
                new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;

            /*
               Default language
            */

            recognition.lang = "en-IN";


            recognition.onstart = () => {

                updateVoiceStatus(
                    "🎙️ Listening..."
                );

                voiceButtons.forEach(button => {
                    button.classList.add("listening");
                });

            };


            recognition.onresult = event => {

                const text =
                    event.results[0][0].transcript.trim();

                if (!text) {
                    updateVoiceStatus(
                        "No speech detected. Please try again."
                    );
                    return;
                }


                updateVoiceStatus(
                    "You said: " + text
                );


                /*
                   Put text into global search
                */

                const searchInput =
                    document.getElementById(
                        "globalSearch"
                    );

                if (searchInput) {
                    searchInput.value = text;
                }


                /*
                   Put text into heritage search
                */

                const heritageInput =
                    document.getElementById(
                        "heritageSearch"
                    );

                if (heritageInput) {
                    heritageInput.value = text;
                }


                /*
                   Search Google
                */

                performVoiceGoogleSearch(text);

            };


            recognition.onerror = event => {

                console.error(
                    "Voice recognition error:",
                    event.error
                );

                let message =
                    "Voice recognition could not start. Please try again.";

                if (event.error === "not-allowed") {

                    message =
                        "🎙️ Microphone permission denied. Please allow microphone access.";

                } else if (event.error === "no-speech") {

                    message =
                        "🎙️ No speech detected. Please speak again.";

                } else if (event.error === "network") {

                    message =
                        "🌐 Network error. Please check your internet connection.";

                } else if (event.error === "audio-capture") {

                    message =
                        "🎤 Microphone is not available.";

                }

                updateVoiceStatus(message);

            };


            recognition.onend = () => {

                voiceButtons.forEach(button => {
                    button.classList.remove("listening");
                });

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

        } catch (error) {

            console.error(
                "Speech Recognition initialization failed:",
                error
            );

            recognition = null;
        }

    }


    /*
       Voice button click
    */

    voiceButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!recognition) {

                    alert(
                        "Voice search is not supported in this browser. Please use Google Chrome or Microsoft Edge."
                    );

                    return;
                }


                /*
                   Select language
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


                /*
                   IMPORTANT:
                   Open blank window immediately
                   to avoid popup blocker.
                */

                try {

                    voiceSearchWindow =
                        window.open(
                            "",
                            "_blank"
                        );

                } catch (error) {

                    voiceSearchWindow = null;

                }


                try {

                    recognition.start();

                } catch (error) {

                    console.warn(
                        "Recognition start error:",
                        error
                    );

                    updateVoiceStatus(
                        "🎙️ Please tap the microphone again."
                    );

                }

            }
        );

    });


    function updateVoiceStatus(message) {

        const status =
            document.getElementById(
                "voiceStatus"
            );

        if (status) {
            status.textContent = message;
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
           If blank window was opened earlier,
           use it.
        */

        if (
            voiceSearchWindow &&
            !voiceSearchWindow.closed
        ) {

            try {

                voiceSearchWindow.location.href =
                    url;

                voiceSearchWindow.focus();

                voiceSearchWindow = null;

                return;

            } catch (error) {

                console.warn(
                    "Could not use voice search window:",
                    error
                );

            }

        }


        /*
           Fallback:
           Open search normally.
        */

        window.open(
            url,
            "_blank"
        );

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

                if (event.key === "Enter") {

                    performHeritageSearch();

                }

            }
        );

    }


    function performHeritageSearch() {

        const query =
            heritageSearch ?
            heritageSearch.value.trim() :
            "";


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
       FIXED FOR GITHUB PAGES
       ===================================================== */

    const startScannerButton =
        document.getElementById(
            "startScanner"
        );


    const stopScannerButton =
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


    let scannerRunning =
        false;


    let scannerCanvas =
        null;


    let scannerCanvasContext =
        null;


    /*
       Native BarcodeDetector
    */

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

            console.warn(
                "BarcodeDetector unavailable:",
                error
            );

            barcodeDetector =
                null;

        }

    }


    /*
       Start button
    */

    if (startScannerButton) {

        startScannerButton.addEventListener(
            "click",
            startCamera
        );

    }


    /*
       Stop button
    */

    if (stopScannerButton) {

        stopScannerButton.addEventListener(
            "click",
            stopCamera
        );

    }


    /*
       Make functions available globally.

       This is important because your HTML
       may contain onclick="startScanner()".
    */

    window.startScanner =
        startCamera;

    window.stopScanner =
        stopCamera;


    /* =====================================================
       START CAMERA
       ===================================================== */

    async function startCamera() {

        /*
           If already running, do nothing.
        */

        if (scannerRunning) {

            if (scannerStatus) {

                scannerStatus.textContent =
                    "📷 Camera is already active.";

            }

            return;

        }


        /*
           Check browser support
        */

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            if (scannerStatus) {

                scannerStatus.textContent =
                    "Camera access is not supported by this browser.";

            }

            alert(
                "Camera access is not supported. Please use Google Chrome or Microsoft Edge."
            );

            return;

        }


        /*
           Check HTTPS / secure context
        */

        if (
            !window.isSecureContext &&
            location.hostname !== "localhost" &&
            location.hostname !== "127.0.0.1"
        ) {

            if (scannerStatus) {

                scannerStatus.textContent =
                    "Camera requires HTTPS. Please open the GitHub Pages HTTPS link.";

            }

            return;

        }


        try {

            if (scannerStatus) {

                scannerStatus.textContent =
                    "📷 Requesting camera permission...";

            }


            /*
               Camera request
            */

            scannerStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
                        },

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }
                    },

                    audio: false

                });


            scannerRunning =
                true;


            /*
               Attach stream to video
            */

            if (scannerVideo) {

                scannerVideo.srcObject =
                    scannerStream;


                scannerVideo.setAttribute(
                    "playsinline",
                    ""
                );


                scannerVideo.muted =
                    true;


                try {

                    await scannerVideo.play();

                } catch (error) {

                    console.warn(
                        "Video autoplay issue:",
                        error
                    );

                }

            }


            if (scannerStatus) {

                scannerStatus.textContent =
                    "📷 Camera active — point it at a QR code.";

            }


            /*
               Native BarcodeDetector
            */

            if (barcodeDetector) {

                scanBarcode();

            } else {

                /*
                   Load jsQR fallback
                */

                await loadJsQR();

                if (window.jsQR) {

                    if (scannerStatus) {

                        scannerStatus.textContent =
                            "📷 Camera active — scanning QR code...";

                    }

                    scanQRCodeFallback();

                } else {

                    if (scannerStatus) {

                        scannerStatus.textContent =
                            "📷 Camera active. QR detection is not available in this browser.";

                    }

                }

            }

        } catch (error) {

            console.error(
                "Camera error:",
                error
            );


            scannerRunning =
                false;

            scannerStream =
                null;


            let message =
                "Camera permission was denied or unavailable.";


            if (
                error.name ===
                "NotAllowedError"
            ) {

                message =
                    "📷 Camera permission denied. Please allow camera access for this site.";

            } else if (
                error.name ===
                "NotFoundError"
            ) {

                message =
                    "📷 No camera was found on this device.";

            } else if (
                error.name ===
                "NotReadableError"
            ) {

                message =
                    "📷 Camera is being used by another application.";

            } else if (
                error.name ===
                "SecurityError"
            ) {

                message =
                    "🔒 Camera access was blocked by browser security.";

            }


            if (scannerStatus) {

                scannerStatus.textContent =
                    message;

            }

        }

    }


    /* =====================================================
       NATIVE BARCODE SCANNER
       ===================================================== */

    async function scanBarcode() {

        if (
            !scannerRunning ||
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


            if (
                codes &&
                codes.length > 0
            ) {

                const value =
                    codes[0].rawValue;


                if (scannerStatus) {

                    scannerStatus.textContent =
                        "✅ Scanned: " + value;

                }


                handleScannedValue(
                    value
                );


                stopCamera();

                return;

            }

        } catch (error) {

            console.warn(
                "Barcode detection:",
                error
            );

        }


        if (scannerRunning) {

            requestAnimationFrame(
                scanBarcode
            );

        }

    }


    /* =====================================================
       LOAD jsQR FALLBACK
       ===================================================== */

    function loadJsQR() {

        return new Promise(resolve => {

            /*
               Already loaded
            */

            if (window.jsQR) {

                resolve(true);
                return;

            }


            /*
               Prevent duplicate script
            */

            const existing =
                document.querySelector(
                    'script[data-jsqr="true"]'
                );


            if (existing) {

                existing.addEventListener(
                    "load",
                    () => resolve(true)
                );

                existing.addEventListener(
                    "error",
                    () => resolve(false)
                );

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";


            script.async =
                true;


            script.dataset.jsqr =
                "true";


            script.onload =
                () => {

                    console.log(
                        "jsQR loaded successfully."
                    );

                    resolve(
                        typeof window.jsQR ===
                        "function"
                    );

                };


            script.onerror =
                () => {

                    console.error(
                        "Could not load jsQR."
                    );

                    resolve(false);

                };


            document.head.appendChild(
                script
            );

        });

    }


    /* =====================================================
       QR FALLBACK SCANNER
       ===================================================== */

    function scanQRCodeFallback() {

        if (
            !scannerRunning ||
            !scannerVideo ||
            !window.jsQR
        ) {

            return;

        }


        /*
           Create canvas only once
        */

        if (!scannerCanvas) {

            scannerCanvas =
                document.createElement(
                    "canvas"
                );

            scannerCanvasContext =
                scannerCanvas.getContext(
                    "2d",
                    {
                        willReadFrequently: true
                    }
                );

        }


        /*
           Video must have dimensions
        */

        if (
            scannerVideo.readyState <
            HTMLMediaElement.HAVE_CURRENT_DATA
        ) {

            requestAnimationFrame(
                scanQRCodeFallback
            );

            return;

        }


        const width =
            scannerVideo.videoWidth;


        const height =
            scannerVideo.videoHeight;


        if (
            !width ||
            !height
        ) {

            requestAnimationFrame(
                scanQRCodeFallback
            );

            return;

        }


        scannerCanvas.width =
            width;


        scannerCanvas.height =
            height;


        try {

            scannerCanvasContext.drawImage(
                scannerVideo,
                0,
                0,
                width,
                height
            );


            const imageData =
                scannerCanvasContext.getImageData(
                    0,
                    0,
                    width,
                    height
                );


            const code =
                window.jsQR(
                    imageData.data,
                    imageData.width,
                    imageData.height,
                    {
                        inversionAttempts:
                            "attemptBoth"
                    }
                );


            if (code) {

                const value =
                    code.data;


                if (scannerStatus) {

                    scannerStatus.textContent =
                        "✅ Scanned: " + value;

                }


                handleScannedValue(
                    value
                );


                stopCamera();

                return;

            }

        } catch (error) {

            console.warn(
                "QR scan error:",
                error
            );

        }


        if (scannerRunning) {

            requestAnimationFrame(
                scanQRCodeFallback
            );

        }

    }


    /* =====================================================
       HANDLE SCANNED QR VALUE
       ===================================================== */

    function handleScannedValue(value) {

        if (!value) return;


        /*
           URL
        */

        if (
            value.startsWith(
                "http://"
            ) ||
            value.startsWith(
                "https://"
            )
        ) {

            setTimeout(() => {

                window.open(
                    value,
                    "_blank",
                    "noopener,noreferrer"
                );

            }, 500);

            return;

        }


        /*
           Normal text
        */

        const searchInput =
            document.getElementById(
                "globalSearch"
            );


        const heritageInput =
            document.getElementById(
                "heritageSearch"
            );


        if (searchInput) {

            searchInput.value =
                value;

        }


        if (heritageInput) {

            heritageInput.value =
                value;

        }


        /*
           Show result if available
        */

        const results =
            document.getElementById(
                "searchResults"
            );


        if (results) {

            results.innerHTML = `

                <article class="result-card">

                    <div style="font-size:32px;">
                        📷
                    </div>

                    <h3>
                        Scanned Heritage Information
                    </h3>

                    <p>
                        ${escapeHTML(value)}
                    </p>

                </article>

            `;

        }

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            value;

        return div.innerHTML;

    }


    /* =====================================================
       STOP CAMERA
       ===================================================== */

    function stopCamera() {

        scannerRunning =
            false;


        if (scannerStream) {

            scannerStream
                .getTracks()
                .forEach(track => {

                    track.stop();

                });

            scannerStream =
                null;

        }


        if (scannerVideo) {

            scannerVideo.pause();

            scannerVideo.srcObject =
                null;

        }


        if (scannerStatus) {

            scannerStatus.textContent =
                "Scanner is ready.";

        }

    }
    window.startScanner = startCamera;
    window.stopScanner = stopCamera;


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


                if (
                    locationStatus &&
                    locationStatus.parentElement
                ) {

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

                } else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {

                    message =
                        "Location information is unavailable.";

                } else if (
                    error.code ===
                    error.TIMEOUT
                ) {

                    message =
                        "Location request timed out.";

                }


                if (locationStatus) {

                    locationStatus.textContent =
                        "📍 " + message;

                }

            },


            {

                enableHighAccuracy:
                    false,

                timeout:
                    10000,

                maximumAge:
                    60000

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


    /* =====================================================
       PAGE INITIALIZATION MESSAGE
       ===================================================== */

    console.log(
        "🌸 Heritage Connect JavaScript loaded successfully."
    );

    console.log(
        "📷 Scanner ready."
    );

    console.log(
        "🎙️ Voice search ready."
    );

});