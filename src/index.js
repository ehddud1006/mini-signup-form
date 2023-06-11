// TODO: 이 곳에 정답 코드를 작성해주세요.
const ERROR_MSG = {
    required: '필수 정보입니다.',
    invalidId:
        '5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.',
    invalidPw: '8~16자 영문 대 소문자, 숫자를 사용하세요.',
    invalidPwCheck: '비밀번호가 일치하지 않습니다.',
}

const BUTTON_VALUE_RANGE = {
    MAX: 20,
    MIN: 12,
}

// 회원가입 폼 DOM Element
const $formWrapper = document.querySelector('.form-wrapper')
const $form = document.querySelector('#form')
const $idInput = document.querySelector('#id')
const $idMsg = document.querySelector('#id-msg')
const $pwInput = document.querySelector('#pw')
const $pwMsg = document.querySelector('#pw-msg')
const $pwCheckInput = document.querySelector('#pw-check')
const $pwCheckMsg = document.querySelector('#pw-check-msg')

// 회원 확인용 모달 DOM Element
const $modal = document.querySelector('#modal')
const $confirmId = document.querySelector('#confirm-id')
const $confirmPw = document.querySelector('#confirm-pw')
const $cancelBtn = document.querySelector('#cancel-btn')
const $approveBtn = document.querySelector('#approve-btn')

const $increaseFontBtn = document.querySelector('#increase-font-btn')
const $decreaseFontBtn = document.querySelector('#decrease-font-btn')

// state
const getFontSize = () =>
    parseInt(getComputedStyle($formWrapper).getPropertyValue('font-size'))

let fontSize = getFontSize()

// signup useCase
const idRegex = /^[a-z0-9_-]{5,20}$/
const pwRegex = /^[a-zA-Z0-9]{8,16}$/

const isEmptyValue = (value) => value === ''
const isValidateId = (userInputValue) => idRegex.test(userInputValue)
const isValidatePw = (userInputValue) => pwRegex.test(userInputValue)
const isPasswordEqual = () => $pwCheckInput.value === $pwInput.value

const isValidate = (target) => {
    const { value: userInputValue, id: identifier } = target

    if (isEmptyValue(userInputValue)) return 'required'

    switch (identifier) {
        case 'id':
            return isValidateId(userInputValue) ? true : 'invalidId'
        case 'pw':
            return isValidatePw(userInputValue) ? true : 'invalidPw'
        case 'pw-check':
            return isPasswordEqual() ? true : 'invalidPwCheck'
    }
}

const printErrorMessage = (textElement, inputElement, isValid) => {
    textElement.textContent = ERROR_MSG[isValid]
    inputElement.classList.add('border-red-600')
}

const resetMessage = (textElement, inputElement) => {
    textElement.textContent = ''
    inputElement.classList.remove('border-red-600')
}

const useValidationHandler = (target, msgTarget) => {
    const isValid = isValidate(target)

    if (isValid !== true) printErrorMessage(msgTarget, target, isValid)

    if (isValid === true) resetMessage(msgTarget, target)

    return isValid
}

const isAllRequirementSatisfy = () =>
    useValidationHandler($idInput, $idMsg) === true &&
    useValidationHandler($pwInput, $pwMsg) === true &&
    useValidationHandler($pwCheckInput, $pwCheckMsg) === true

// handler
$idInput.addEventListener('blur', () => useValidationHandler($idInput, $idMsg))
$pwInput.addEventListener('blur', () => useValidationHandler($pwInput, $pwMsg))
$pwCheckInput.addEventListener('blur', () =>
    useValidationHandler($pwCheckInput, $pwCheckMsg)
)
$form.addEventListener('submit', handleFormSubmit)
$cancelBtn.addEventListener('click', handleCancelBtnClick)
$approveBtn.addEventListener('click', handleApproveBtnClick)
$increaseFontBtn.addEventListener('click', () => handleFontBtnClick('increase'))
$decreaseFontBtn.addEventListener('click', () => handleFontBtnClick('decrease'))

// init
$idInput.focus()

function handleFormSubmit(e) {
    e.preventDefault()

    if (isAllRequirementSatisfy()) {
        $modal.showModal()
        $confirmId.textContent = $idInput.value
        $confirmPw.textContent = $pwInput.value
    }
}

function handleCancelBtnClick() {
    $modal.close()
}

function handleApproveBtnClick() {
    alert('가입되었습니다 🥳 ')
    $modal.close()
}

function handleFontBtnClick(flag) {
    if (flag === 'increase' && fontSize >= BUTTON_VALUE_RANGE.MAX) return
    if (flag === 'decrease' && fontSize <= BUTTON_VALUE_RANGE.MIN) return

    fontSize += flag === 'increase' ? 1 : -1
    $formWrapper.style.fontSize = `${fontSize}px`

    $increaseFontBtn.disabled = fontSize >= BUTTON_VALUE_RANGE.MAX
    $decreaseFontBtn.disabled = fontSize <= BUTTON_VALUE_RANGE.MIN
}
