/* UI Lab — hard UI cases, self-contained. Only loaded by /learning/ui-lab.html. */
(function () {
  "use strict";

  var PROMO_MIN_DELAY_MS = 300;
  var PROMO_MAX_DELAY_MS = 1500;

  function setPromoState(state) {
    var el = document.getElementById("ui-lab-promo-state");
    if (el) {
      el.textContent = "promo:" + state;
    }
    document.body.dataset.uiLabPromoState = state;
  }

  function setStatus(status) {
    var el = document.getElementById("ui-lab-status");
    if (el) {
      el.textContent = "status:" + status;
    }
    document.body.dataset.uiLabStatus = status;
  }

  function setAdState(state) {
    document.body.dataset.uiLabAdState = state;
  }

  function shouldShowPromo(mode) {
    if (mode === "never") {
      return false;
    }
    if (mode === "random") {
      return Math.random() < 0.5;
    }
    return true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    var promoMode = params.get("promo") || "always";

    var promo = document.getElementById("ui-lab-promo");
    var ad = document.getElementById("ui-lab-ad");
    var startButton = document.getElementById("ui-lab-start");
    var dialogResult = document.getElementById("ui-lab-dialog-result");

    function enableStart() {
      if (startButton) {
        startButton.disabled = false;
      }
    }

    function resolvePromo(state) {
      if (promo) {
        promo.classList.remove("visible");
        promo.style.display = "none";
      }
      setPromoState(state);
      enableStart();
    }

    // 1. Random promo + click interception
    setPromoState("waiting");
    setAdState("visible");

    if (startButton) {
      startButton.disabled = true;
    }

    if (!promo || !shouldShowPromo(promoMode)) {
      setPromoState("skipped");
      enableStart();
    } else {
      var delay =
        PROMO_MIN_DELAY_MS + Math.floor(Math.random() * (PROMO_MAX_DELAY_MS - PROMO_MIN_DELAY_MS));
      window.setTimeout(function () {
        promo.style.display = "flex";
        promo.classList.add("visible");
        setPromoState("shown");
      }, delay);
    }

    document.getElementById("ui-lab-promo-close").addEventListener("click", function () {
      resolvePromo("dismissed");
    });
    document.getElementById("ui-lab-promo-accept").addEventListener("click", function () {
      resolvePromo("accepted");
    });
    if (promo) {
      promo.addEventListener("click", function (event) {
        if (event.target === promo) {
          resolvePromo("dismissed");
        }
      });
    }

    document.getElementById("ui-lab-ad-close").addEventListener("click", function () {
      if (ad) {
        ad.style.display = "none";
        ad.setAttribute("hidden", "");
      }
      setAdState("dismissed");
    });

    if (startButton) {
      startButton.addEventListener("click", function () {
        setStatus("flow-started");
      });
    }

    // 2. Native dialogs
    document.getElementById("ui-lab-alert").addEventListener("click", function () {
      window.alert("Enrollment completed successfully");
      dialogResult.textContent = "alert:acknowledged";
    });

    document.getElementById("ui-lab-confirm").addEventListener("click", function () {
      var confirmed = window.confirm("Are you sure you want to enroll in this course?");
      dialogResult.textContent = "confirm:" + confirmed;
    });

    document.getElementById("ui-lab-prompt").addEventListener("click", function () {
      var nickname = window.prompt("Enter a nickname for your certificate", "guest");
      dialogResult.textContent = "prompt:" + (nickname === null ? "null" : nickname);
    });

    // 4. New tab
    document.getElementById("ui-lab-open-tab").addEventListener("click", function () {
      window.open("./ui-lab-handbook.html", "_blank");
    });

    // 5. Blob download
    document.getElementById("ui-lab-download-blob").addEventListener("click", function () {
      var csv = ["course,students", "UI Lab Basics,42", "Automation 101,17"].join("\n") + "\n";
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "ui-lab-report.csv";
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus("blob-downloaded");
    });
  });
})();
