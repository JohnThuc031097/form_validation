const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
  statusValidate: {},
  options: {},
  init(options) {
    this.options = options;
  },
  run() {
    this.rulesSelector((selector, rule, element) => {
      console.group(selector);
      console.log(rule);
      console.groupEnd();
      this.statusValidate[selector] = { error: true };
      element.onblur = () => {
        this.checkError(rule, element.value.trim(), msgError => {
          this.statusValidate[selector].error = (typeof msgError !== 'undefined') ? true : false;
          this.setError(element, msgError);
        });
      };
      element.oninput = () => {
        this.checkError(rule, element.value.trim(), msgError => {
          this.statusValidate[selector].error = (typeof msgError !== 'undefined') ? true : false;
          this.setError(element, msgError);
        });
      };
    });
  },
  submit(callback) {
    let isError = false;
    let dataForm = {};
    this.rulesSelector((selector, rule, element) => {
      let isRequired = options.rules[selector].some(rule => rule['isRequired']);
      if (this.statusValidate[selector].error && isRequired) {
        this.checkError(rule, element.value.trim(), msgError => {
          this.statusValidate[selector].error = (typeof msgError !== 'undefined') ? true : false;
          this.setError(selector, msgError);
          isError = true;
        });
      } else {
        dataForm[selector] = element.value;
      }
    });
    !isError && callback(dataForm);
  },
  rulesSelector(callback) {
    if ($(this.options.formSelector)) {
      let rules = this.options.rules;
      for (const selector in rules) {
        $(selector) && callback(selector, rules[selector], $(selector));
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
  setError(selector, msgError) {
    let eBox = $(`${this.options.boxSelector[selector]} ${selector}`);
    let eMsg = $(`${this.options.messageSelector[selector]} ${selector}`);
    console.log(eBox, eMsg);
    if (msgError) {
      eBox && eBox.classList.add('invalid');
      eMsg && (eMsg.innerHTML = msgError);
    } else {
      eBox && eBox.classList.remove('invalid');
      eMsg && (eMsg.innerHTML = '');
    }
    // if (msgError) {
    //   e.parentElement && e.parentElement.classList.add('invalid');
    //   e.nextElementSibling && (e.nextElementSibling.innerHTML = msgError);
    // } else {
    //   e.nextElementSibling && (e.nextElementSibling.innerHTML = '');
    //   e.parentElement && e.parentElement.classList.remove('invalid');
    // }
  },
};