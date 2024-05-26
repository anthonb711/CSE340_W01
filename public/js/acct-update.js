const form = document.querySelector("#updateAcctForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector('input[type="submit"]')
      updateBtn.removeAttribute("disabled")
    })