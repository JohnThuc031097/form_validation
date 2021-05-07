const $ = document.querySelector.bind(document);

const Validator = {
  run(options) {
    let eForm = $(options.form);
    if (eForm) {
      options.rules.forEach(rule => {
        let eInput = $(rule.selector);
        if (eInput) {
          eInput.onblur = (e) => {
            this.validateCheck(e.target, rule);
          };
          eInput.oninput = (e) => {
            this.validateCheck(e.target, rule);
          };
        }
      });
    }
  },
  validateSetError(e, value) {
    e.nextElementSibling && (e.nextElementSibling.innerHTML = value);
  },
  validateActive(e) {
    e.parentElement && e.parentElement.classList.add('invalid');
  },
  validateRemove(e) {
    e.parentElement && e.parentElement.classList.remove('invalid');
  },
  validateCheck(e, rule) {
    let msgError = rule.test(e.value.trim());
    if (msgError) {
      this.validateActive(e);
      this.validateSetError(e, msgError);
    } else {
      this.validateSetError(e, '');
      this.validateRemove(e);
    }
  }
};

Validator.isRequired = (selector, msg = 'Vui lòng nhập trường này!') => {
  return {
    selector,
    test(value) {
      return value === '' ? msg : undefined;
    }
  };
};

Validator.isEmail = (selector, msg = 'Email không hợp lệ!') => {
  return {
    selector,
    test(value) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return !re.test(String(value).toLowerCase()) ? msg : undefined
    }
  };
};

Validator.maxLength = (selector, max, msg = 'Độ dài chuỗi vượt quá giới hạn') => {
  return {
    selector,
    test(value) {
      return value.length > max ? msg : undefined;
    }
  };
};

Validator.minLength = (selector, min, msg = 'Độ dài chuỗi tối thiểu không đủ') => {
  return {
    selector,
    test(value) {
      return value.length < min ? msg : undefined;
    }
  };
};

Validator.isConfirmed = (selector, getConfirmValue, msg = 'Giá trị nhập vào không trùng khớp') => {
  return {
    selector,
    test(value) {
      return value === getConfirmValue() ? undefined : msg;
    }
  }
}