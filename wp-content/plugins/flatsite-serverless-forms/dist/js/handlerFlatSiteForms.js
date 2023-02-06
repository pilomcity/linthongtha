let flatSiteFormsObject = {
  endpoint: function () { return flatSiteForms.wp_flatsite_forms_endpoint },
  admin: function () { return flatSiteForms.is_user_logged_in },
  custom: function () { return flatSiteForms.wp_flatsite_forms_lookup },
  redirect: function () { return flatSiteForms.wp_flatsite_forms_redirect },
  init: function () {
    if ((this.endpoint()).length === 0) {
      if ((this.admin()).length !== 0) {
        console.log("FLATsite Serverless Forms is installed but no endpoint is set.");
      }
    }


    document.addEventListener("DOMContentLoaded", function () {
      let search = ("form[data-flatsite='true'], .wpcf7 form, .wpcf7-form, .gform_wrapper form, .wpforms-container form");

      search = (this.custom() === '' ? search : search + ", " + this.custom());

      const allForms = document.querySelectorAll(search);
      allForms.forEach(function (form) {
        this.cutAttributes(form);

        const inputs = form.querySelectorAll("input");
        inputs.forEach((input) => {
          if (input.getAttribute("aria-required") === "true") {
            input.required = true;
          }
        });

        form.addEventListener("submit", function (el) {

          el.preventDefault();
          var data = this.cleanInputs(form);
          this.submit("POST", this.endpoint(), data, el);
        }.bind(this));
      }.bind(this));
    }.bind(this));

  },
  cleanInputs: function (form) {
    var data = new FormData(form);
    var toDelete = new Array();
    for (const pair of data.entries()) {
      if (pair[0].startsWith('_wpcf7')) {
        toDelete.push(pair[0]);
      }
    }

    for (const field in toDelete) {
      data.delete(toDelete[field]);
    }
    return data;
  },
  submitSuccess: function (element) {
    element.target.submit.disabled = false;
    element.target.querySelector('input[type="submit"]').blur();
    element.target.reset();

    // Redirect if set
    let pathToRedirect = this.redirect();

    if (pathToRedirect.length > 0) {
      window.location.replace(pathToRedirect);
    }
  },
  submitError: function (element) {
    element.target.querySelector('input[type="submit"]').disabled = false;
    alert("Oops! There was an error.");
  },
  submit: function (method, url, data, el) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        this.submitSuccess(el);
      } else {
        this.submitError(el);
      }
    }.bind(this);

    xhr.send(data);
  },
  cutAttributes: function (form) {
    form.removeAttribute("action");
    form.removeAttribute("method");
    form.removeAttribute("enctype");
    form.removeAttribute("novalidate");
    form.setAttribute("data-wp-flatsite-forms", true);
  }
}
// Init FlatSite
flatSiteFormsObject.init();

