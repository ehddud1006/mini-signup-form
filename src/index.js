// TODO: 이 곳에 정답 코드를 작성해주세요.
const ALERT_MESSAGE = {
    ESSENTIAL: '필수 정보입니다.',
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
let $dimmed = document.createElement('div')

const $increaseFontBtn = document.querySelector('#increase-font-btn')
const $decreaseFontBtn = document.querySelector('#decrease-font-btn')

// state
const computedFormStyle = getComputedStyle($formWrapper)
let fontSize = parseInt(computedFormStyle.getPropertyValue('font-size'))

const validationPassed = {
    id: false,
    pw: false,
    pwCheck: false,
}

// signup useCase
const idRegex = /^[a-z0-9_-]{5,20}$/
const pwRegex = /^[a-zA-Z0-9]{8,16}$/

const isEmptyValue = (value) => value === ''
const isValidateId = (userInputValue) => idRegex.test(userInputValue)
const isValidatePw = (userInputValue) => pwRegex.test(userInputValue)
const isPasswordEqual = () => {
    if ($pwCheckInput.value === $pwInput.value) {
        resetMessage($pwCheckMsg, $pwCheckInput)
        validationPassed.pwCheck = true

        return true
    }

    return false
}
const isAllRequirementSatisfy = () =>
    Object.values(validationPassed).every((isValid) => isValid)

const printErrorMessage = (textElement, inputElement, errorMessage) => {
    textElement.textContent = errorMessage
    inputElement.classList.add('border-red-600')
}

const resetMessage = (textElement, inputElement) => {
    textElement.textContent = ''
    inputElement.classList.remove('border-red-600')
}

// handler
$idInput.addEventListener('blur', handleIdInputBlur)
$pwInput.addEventListener('blur', handlePwInputBlur)
$pwCheckInput.addEventListener('blur', handlePwCheckInputBlur)
$form.addEventListener('submit', handleFormSubmit)
$cancelBtn.addEventListener('click', handleCancelBtnClick)
$approveBtn.addEventListener('click', handleApproveBtnClick)
$increaseFontBtn.addEventListener('click', handleIncreaseFontBtnClick)
$decreaseFontBtn.addEventListener('click', handleDecreaseFontBtnClick)

// init
$idInput.focus()

function handleIdInputBlur(e) {
    const { value } = e.target

    if (isEmptyValue(value)) {
        printErrorMessage($idMsg, $idInput, ALERT_MESSAGE.ESSENTIAL)
        return
    }

    if (!isValidateId(value)) {
        printErrorMessage(
            $idMsg,
            $idInput,
            '5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.'
        )
        return
    }

    resetMessage($idMsg, $idInput)
    validationPassed.id = true
}

function handlePwInputBlur(e) {
    const { value } = e.target

    if (isEmptyValue(value)) {
        printErrorMessage($pwMsg, $pwInput, ALERT_MESSAGE.ESSENTIAL)
        return
    }

    if (!isValidatePw(value)) {
        printErrorMessage(
            $pwMsg,
            $pwInput,
            '8~16자 영문 대 소문자, 숫자를 사용하세요.'
        )
        return
    }

    isPasswordEqual()

    resetMessage($pwMsg, $pwInput)
    validationPassed.pw = true
}

function handlePwCheckInputBlur(e) {
    const { value: pwCheckValue } = e.target

    if (isEmptyValue(pwCheckValue)) {
        printErrorMessage($pwCheckMsg, $pwCheckInput, ALERT_MESSAGE.ESSENTIAL)
        return
    }

    if (isPasswordEqual()) return

    printErrorMessage(
        $pwCheckMsg,
        $pwCheckInput,
        '비밀번호가 일치하지 않습니다.'
    )
}

function handleFormSubmit(e) {
    e.preventDefault()

    isPasswordEqual()

    if (isAllRequirementSatisfy()) {
        $modal.open = true
        $confirmId.textContent = $idInput.value
        $confirmPw.textContent = $pwInput.value

        $dimmed = document.createElement('div')
        Object.assign($dimmed.style, {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        })
        $modal.insertAdjacentElement('beforebegin', $dimmed)
    }
}

function modalClose() {
    $modal.open = false
    $dimmed.remove()
}

function handleCancelBtnClick() {
    modalClose()
}

function handleApproveBtnClick() {
    alert('가입되었습니다 🥳 ')
    modalClose()
}

function handleIncreaseFontBtnClick() {
    if (fontSize >= BUTTON_VALUE_RANGE.MAX) return

    fontSize += 1
    $formWrapper.style.fontSize = `${fontSize}px`

    if (fontSize >= BUTTON_VALUE_RANGE.MAX) $increaseFontBtn.disabled = true
    if (fontSize > BUTTON_VALUE_RANGE.MIN) $decreaseFontBtn.disabled = false
}

function handleDecreaseFontBtnClick() {
    if (fontSize <= BUTTON_VALUE_RANGE.MIN) return

    fontSize -= 1
    $formWrapper.style.fontSize = `${fontSize}px`

    if (fontSize <= BUTTON_VALUE_RANGE.MIN) $decreaseFontBtn.disabled = true
    if (fontSize < BUTTON_VALUE_RANGE.MAX) $increaseFontBtn.disabled = false
}
