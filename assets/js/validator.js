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
  },

  minChecked: (min, msg = 'Giá trị chọn tối thiểu không đủ') => {
    return {
      test(values) {
        return (values < min ? msg : undefined);
      }
    };
  },
}

const Validator = {
  statusValidate: {},
  options: {},
  init(options) {
    this.options = options;
  },
  run() {
    this.rulesSelector((selector, element, rules, isRequired) => {
      console.group(selector);
      console.log(rules);
      console.groupEnd();
      this.statusValidate[selector] = { error: true };
      switch (element.type) {
        case "radio":
          $$(selector).forEach(e => {
            e.onclick = () => {
              this.checkError(selector, e, rules, msgError => {
                this.statusValidate[selector].error = (typeof msgError !== 'undefined');
                this.setError(selector, msgError);
              });
            }
          })
          break;
        case "checkbox":
          $$(selector).forEach(e => {
            e.onclick = () => {
              this.checkError(selector, e, rules, msgError => {
                this.statusValidate[selector].error = (typeof msgError !== 'undefined');
                this.setError(selector, msgError);
              });
            }
          })
          break;
        default:
          element.onblur = () => {
            this.checkError(selector, element, rules, msgError => {
              this.statusValidate[selector].error = (typeof msgError !== 'undefined');
              this.setError(selector, isRequired && msgError);
            });
          };
          element.oninput = () => {
            this.checkError(selector, element, rules, msgError => {
              this.statusValidate[selector].error = (typeof msgError !== 'undefined');
              this.setError(selector, msgError);
            });
          };
          break;
      }
    });
  },
  submit(callback) {
    let isError = false;
    let dataForm = {};
    this.rulesSelector((selector, element, rules, isRequired) => {
      if (this.statusValidate[selector].error && isRequired) {
        this.checkError(selector, element, rules, msgError => {
          this.statusValidate[selector].error = (typeof msgError !== 'undefined');
          this.setError(selector, msgError);
          isError = true;
        });
      } else {
        let value = undefined;
        switch (element.type) {
          case 'radio':
            [...$$(selector)].forEach((e) => {
              return (e.checked) && (value = e.value);
            });
            break;
          case 'checkbox':
            value = [...$$(selector)].reduce((total, e) => {
              return (e.checked) ? (total = [...total, e.value]) : total;
            }, []);
            break;
          default:
            value = element.value.trim();
            break;
        }
        dataForm[selector] = value;
      }
    });
    !isError && callback(dataForm);
  },
  rulesSelector(callback) {
    if ($(this.options.formSelector)) {
      let rules = this.options.rules;
      for (const selector in rules) {
        if ($(selector)) {
          let isRequired = options.rules[selector].some(rule => rule['isRequired']);
          callback(selector, $(selector), rules[selector], isRequired);
        }
      }
    }
  },
  checkError(selector, element, rules, callback) {
    let msgError = undefined;
    let value = '';
    switch (element.type) {
      case 'radio':
        [...$$(selector)].some(e => e.checked) && (value = 'checked');
        break;
      case 'checkbox':
        value = [...$$(selector)].reduce((total, e) => {
          return e.checked ? (total + 1) : total;
        }, 0);
        value = (value === 0) ? '' : value;
        break;
      default:
        value = element.value.trim();
        break;
    }
    rules.some(rule => {
      let key = Object?.keys(rule)[0];
      return (msgError = ValidatorRules[key](...rule[key]).test(value));
    });
    callback(msgError);
  },
  setError(selector, msgError) {
    let eBox = $(this.options.boxSelector[selector]).parentElement;
    let eMsg = $(this.options.messageSelector[selector]);
    // console.log(eBox, eMsg);
    if (msgError) {
      eBox && eBox.classList.add('invalid');
      eMsg && (eMsg.innerHTML = msgError);
    } else {
      eBox && eBox.classList.remove('invalid');
      eMsg && (eMsg.innerHTML = '');
    }
  },
};