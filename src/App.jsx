import { useState } from 'react'
import './App.css'

/* постійні величини (можеш винести у .env, якщо треба) */
const MIN_SALARY = 8000          // мінімальна ЗП (грн)
const ESVCoefficient = 0.22      // ставка ЄСВ
const SINGLE_TAX = 0.05          // 5 % єдиний податок
const WAR_TAX = 0.015            // 1,5 % військовий збір

export default function App() {
  const [income, setIncome] = useState('')
  const [mode, setMode] = useState('month')   // 'month' | 'quarter'

  /* парсимо введення */
  const gross = parseFloat(income)
  const isValid = !isNaN(gross) && gross >= 0

  /* щомісячні показники */
  const singleTaxMo = isValid ? gross * SINGLE_TAX : 0
  const warTaxMo    = isValid ? gross * WAR_TAX    : 0
  const esvMo       = MIN_SALARY * ESVCoefficient      // ЄСВ не залежить від доходу

  /* множник для обраного режиму */
  const multiplier  = mode === 'quarter' ? 3 : 1

  /* квартал = 3 місяці, тому ЄСВ × 3 теж */
  const singleTax   = singleTaxMo * multiplier
  const warTax      = warTaxMo    * multiplier
  const esv         = esvMo       * multiplier

  const totalTaxes  = singleTax + warTax + esv
  const netIncome   = isValid ? gross * multiplier - totalTaxes : 0

  return (
    <main className="app">
      <h1 className="title">
        Калькулятор&nbsp;податків&nbsp;ФОП&nbsp;III&nbsp;групи
      </h1>

      <input
        className="income-input"
        type="number"
        placeholder="Дохід за місяць, грн"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <div className="mode-switcher">
        <label>
          <input
            type="radio"
            value="month"
            checked={mode === 'month'}
            onChange={() => setMode('month')}
          />
          Місяць
        </label>
        <label>
          <input
            type="radio"
            value="quarter"
            checked={mode === 'quarter'}
            onChange={() => setMode('quarter')}
          />
          Квартал
        </label>
      </div>

      <section className="results">
        <p>Єдиний&nbsp;податок&nbsp;(5 %): <span>{isValid ? singleTax.toFixed(2) : '—'} грн</span></p>
        <p>Військовий&nbsp;збір&nbsp;(1.5 %): <span>{isValid ? warTax.toFixed(2) : '—'} грн</span></p>
        <p>ЄСВ&nbsp;(22 % від&nbsp;{MIN_SALARY}): <span>{esv.toFixed(2)} грн</span></p>
        <hr />
        <p>Загальні&nbsp;податки: <span>{isValid ? totalTaxes.toFixed(2) : '—'} грн</span></p>
        <p className="net">Чистий&nbsp;дохід: <span>{isValid ? netIncome.toFixed(2) : '—'} грн</span></p>
      </section>
    </main>
  )
}
