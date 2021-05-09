const $ = document.querySelector.bind(document);

const ValidatorRules = {
  isRequired: (msg = 'Vui lòng nhập trường này!') => {
    return {
      test(value) {
        return (value === '' ? msg : undefined);
      }
    };
  },

  isEmail: (msg = 'Email không hợp lệ!') => {
    return {
      test(value) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (!re.test(String(value).toLowerCase()) ? msg : undefined);
      }
    };
  },

  maxLength: (max, msg = 'Độ dài chuỗi vượt quá giới hạn') => {
    return {
      test(value) {
        return (value.length > max ? msg : undefined);
      }
    };
  },

  minLength: (min, msg = 'Độ dài chuỗi tối thiểu không đủ') => {
    return {
      test(value) {
        return (value.length < min ? msg : undefined);
      }
    };
  },

  isConfirmed: (callback, msg = 'Giá trị nhập vào không trùng khớp') => {
    return {
      test(value) {
        return (value === callback() ? undefined : msg);
      }
    }
  }
}

const Validator = {

  run(options) {
    let eForm = $(options.form);
    if (eForm) {
      let rules = options.rules;
      for (const selector in rules) {
        let rulesSelector = rules[selector];
        console.group(selector);
        console.log(rulesSelector);
        console.groupEnd();
        let eInput = $(selector);
        if (eInput) {
          eInput.onblur = () => {
            this.checkError(rulesSelector, eInput.value.trim(), msgError => {
              this.setError(eInput, msgError);
            });
          };
          eInput.oninput = () => {
            this.checkError(rulesSelector, eInput.value.trim(), msgError => {
              this.setError(eInput, msgError);
            });
          };
        }
      }
    }
  },
  checkError(rules, value, callback) {
    let msgError = '';
    rules.some(rule => {
      let key = Object?.keys(rule)[0];
      return (msgError = ValidatorRules[key](...rule[key]).test(value));
    });
    callback(msgError);
  },
  setError(e, msgError) {
    if (msgError) {
      e.parentElement && e.parentElement.classList.add('invalid');
      e.nextElementSibling && (e.nextElementSibling.innerHTML = msgError);
    } else {
      e.nextElementSibling && (e.nextElementSibling.innerHTML = '');
      e.parentElement && e.parentElement.classList.remove('invalid');
    }
  }
};