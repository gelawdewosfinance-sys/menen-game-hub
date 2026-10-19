

const $ = (id) => document.getElementById(id);

const DEFAULT_COINS = 100;
let coins = DEFAULT_COINS;

try {
  const savedCoins = Number(localStorage.getItem("menen_demo_coins"));
  if (Number.isFinite(savedCoins) && savedCoins >= 0) {
    coins = savedCoins;
  }
} catch (_) {}

function updateCoins() {
  $("headerCoins").textContent = coins;
  $("profileCoins").textContent = coins;
  $("gameCoins").textContent = coins;

  try {
    localStorage.setItem("menen_demo_coins", String(coins));
  } catch (_) {}
}

function showMessage(id, message) {
  $(id).textContent = message;
}

// Load saved name
let savedName = "Menen Player";

try {
  savedName = localStorage.getItem("menen_demo_name") || savedName;
} catch (_) {}

$("nameInput").value = savedName;
$("displayName").textContent = savedName;

// Save profile name
$("saveProfile").addEventListener("click", () => {
  const name = $("nameInput").value.trim();

  if (!name) {
    showMessage("profileMessage", "እባክህ ስምህን አስገባ።");
    return;
  }

  $("displayName").textContent = name;

  try {
    localStorage.setItem("menen_demo_name", name);
  } catch (_) {}

  showMessage("profileMessage", "ስምህ ተቀምጧል።");
});

// Choose a profile photo
$("photoInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showMessage("profileMessage", "እባክህ የምስል ፋይል ምረጥ።");
    return;
  }

  if (file.size > 3 * 1024 * 1024) {
    showMessage("profileMessage", "ፎቶው ከ3 MB በታች መሆን አለበት።");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const image = document.createElement("img");
    image.alt = "Profile photo";
    image.src = reader.result;

    const avatar = $("avatarPreview");
    avatar.replaceChildren(image);

    try {
      localStorage.setItem("menen_demo_photo", reader.result);
      showMessage("profileMessage", "ፎቶህ በዚህ ብራውዘር ተቀምጧል።");
    } catch (_) {
      showMessage(
        "profileMessage",
        "ፎቶው ታይቷል፣ ግን ለማስቀመጥ በቂ ቦታ የለም።"
      );
    }
  };

  reader.readAsDataURL(file);
});

// Restore photo
try {
  const savedPhoto = localStorage.getItem("menen_demo_photo");
  if (savedPhoto) {
    const image = document.createElement("img");
    image.alt = "Profile photo";
    image.src = savedPhoto;
    $("avatarPreview").replaceChildren(image);
  }
} catch (_) {}

// Bottom navigation: Game and Profile
document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.page;

    document.querySelectorAll(".page-section").forEach((section) => {
      section.classList.toggle("hidden", section.id !== target);
    });

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Demo coin sending: deducts coins locally only
$("sendCoins").addEventListener("click", () => {
  const recipient = $("recipientInput").value.trim();
  const amount = Number($("amountInput").value);

  if (!recipient) {
    showMessage("sendMessage", "የተቀባዩን username አስገባ።");
    return;
  }

  if (recipient.toLowerCase() === $("displayName").textContent.toLowerCase()) {
    showMessage("sendMessage", "ለራስህ መላክ አትችልም።");
    return;
  }

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    showMessage("sendMessage", "ትክክለኛ የኮይን ብዛት አስገባ።");
    return;
  }

  if (amount > coins) {
    showMessage("sendMessage", "በቂ ኮይን የለህም።");
    return;
  }

  coins -= amount;
  updateCoins();

  showMessage(
    "sendMessage",
    `${amount} demo coins ከሂሳብህ ተቀንሰዋል። ወደ ሌላ አካውንት አልተላኩም።`
  );

  $("amountInput").value = "";
});

// Verification sample: never uploads the selected ID
$("verificationButton").addEventListener("click", () => {
  showMessage(
    "verificationMessage",
    "ይህ የማሳያ ስሪት ነው። መታወቂያህን እዚህ አትስቀል። እውነተኛ ማረጋገጫ ደህንነቱ የተጠበቀ ሰርቨር ያስፈልገዋል።"
  );
});

// Google sign-in sample
$("googleButton").addEventListener("click", () => {
  showMessage(
    "googleMessage",
    "Google sign-in ገና አልተገናኘም። ለማስኬድ OAuth ውቅር ያስፈልጋል።"
  );
});

// Sample game cards
document.querySelectorAll("[data-game]").forEach((button) => {
  button.addEventListener("click", () => {
    alert("ይህ ጨዋታ በቅርቡ ይጨመራል።");
  });
});

updateCoins();
