import React, { PropTypes } from 'react'
import Select from 'react-select'
import {
  Button,
  Col,
  Grid,
  Row,
  Tooltip,
  OverlayTrigger,
  Glyphicon,
} from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import ArrayCheckbox from '../../../components/ArrayCheckbox'
import {
  LANGUAGE_CHOICES,
  ETHNICITY_CHOICES,
  MEDICAL_CHOICES,
  SUPPORT_CHOICES,
  PRIMARY_HEALTHCARE_CHOICES,
  LENGTH_OF_HOMELESSNESS_CHOICES
} from '../constants/check-in'
import classes from './CheckInForm.scss'

export const CheckInForm = (props) => {
  let {
    fields: {
      firstName, lastName, socialSecurityNumber, dateOfBirth, phoneNumber, emailAddress,
      gender, isLGBTQ,
      ethnicity, ethnicityOther,
      language, languageOther,
      hasBeenInFosterCare,
      hasServedInTheMilitary,
      primaryHealthcareLocation,
      isHomeless, lengthOfHomelessness,
      medicalServices, supportServices,
    },
    resetForm,
    handleSubmit,
    requesting,
    currentAccount,
    errors,
    submitFailed
  } = props

  // initialize array fields to empty arrays
  ethnicity.value = ethnicity.value || []
  medicalServices.value = medicalServices.value || []
  supportServices.value = supportServices.value || []

  const _onSubmit = () => {
    const fields = props.fields
    const newFields = {}

    for (let field in fields) {

      // skip alt fields, which have their own handlers to update fields correctly
      if (field.endsWith('Other')) continue

      // deal with checkboxes, and checkbox-like inputs differently
      if (fields[field].checked !== undefined) {
        newFields[field] = fields[field].checked
      } else if (fields[field].value !== ""){
        newFields[field] = fields[field].value
      }

    }

    props.updateInfo(newFields, currentAccount && currentAccount.id)
  }

  const _onClear = () => {
    props.clearInfo()
  }

  if (currentAccount) {
    if (currentAccount.firstName) {
      firstName.disabled = true;
    } else {
      delete firstName.disabled;
    }

    if (currentAccount.lastName) {
      lastName.disabled = true;
    } else {
      delete lastName.disabled;
    }

    if (currentAccount.socialSecurityNumber && currentAccount.socialSecurityNumber.length === 9) {
      socialSecurityNumber.disabled = true;
    } else {
      delete socialSecurityNumber.disabled;
    }

    if (currentAccount.dateOfBirth) {
      dateOfBirth.disabled = true;
    } else {
      delete dateOfBirth.disabled;
    }
  }

  const identificationTooltip = (
    <Tooltip id="tooltip">This is optional and only used for helping us identify you in the future. </Tooltip>
  )

  const demographicTooltip = (
    <Tooltip id="tooltip">
      We ask this question for the purpose of collecting information about whom we serve,
      and how to better reach at-risk demographics.
    </Tooltip>
  )

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>

      <div className={classes.basic + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>First Name {firstName.touched && firstName.error && <span className={classes.errorMessage}>{firstName.error}</span>}</label>
          <input className={classes.textInput} type="text" {...firstName} />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Last Name {lastName.touched && lastName.error && <span className={classes.errorMessage}>{lastName.error}</span>}</label>
          <input className={classes.textInput} type="text" {...lastName} />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>
            { "Social Security Number " }
            <OverlayTrigger placement="right" overlay={identificationTooltip}>
              <Glyphicon glyph="info-sign"/ >
            </OverlayTrigger>
            {socialSecurityNumber.touched && socialSecurityNumber.error && <span className={classes.errorMessage}>{socialSecurityNumber.error}</span>}
          </label>
          <input
            className={classes.textInput}
            type="phone"
            {...socialSecurityNumber}
          />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Date of Birth (mm-dd-yyyy) {dateOfBirth.touched && dateOfBirth.error && <span className={classes.errorMessage}>{dateOfBirth.error}</span>}</label>
          <input
            className={classes.textInput}
            type="phone"
            {...dateOfBirth}
          />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Phone {phoneNumber.touched && phoneNumber.error && <span className={classes.errorMessage}>{phoneNumber.error}</span>}</label>
          <input className={classes.textInput} type="phone" {...phoneNumber} />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Email Address {emailAddress.touched && emailAddress.error && <span className={classes.errorMessage}>{emailAddress.error}</span>}</label>
          <input className={classes.textInput} type="email" {...emailAddress} />
        </div>
      </div>

      <div className={classes.gender + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Gender</label>

          <div className={classes.horizontalInputs}>
            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  {...gender}
                  type="radio"
                  value="Male"
                  checked={gender.value === "Male"}
                />
                Male
              </label>
            </div>

            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  {...gender}
                  type="radio"
                  value="Female"
                  checked={gender.value === "Female"}
                />
                Female
              </label>
            </div>

            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  {...gender}
                  type="radio"
                  value="Non-binary"
                  checked={gender.value === "Non-binary"}
                />
                Non-binary gender
              </label>
            </div>
          </div>

          {gender.touched && gender.error && <span className={classes.errorMessage}>{gender.error}</span>}
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>
          { "Do you identify as LGBTQ? " }
          <OverlayTrigger placement="right" overlay={demographicTooltip}>
            <Glyphicon glyph="info-sign"/ >
          </OverlayTrigger>

          </label>

          <div className={classes.toggleInputGroup}>
            <div className={classes.horizontalInputs}>
              <div className={classes.toggleInputGroup}>
                <label>
                  <input
                    type="radio"
                    {...isLGBTQ}
                    value="true"
                    checked={isLGBTQ.value === "true"}
                  />
                  Yes
                </label>
              </div>

              <div className={classes.toggleInputGroup}>
                <label>
                  <input
                    type="radio"
                    {...isLGBTQ}
                    value="false"
                    checked={isLGBTQ.value === "false"}
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.ethnicity + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>
            { "Ethnicity " }
            <OverlayTrigger placement="right" overlay={demographicTooltip}>
              <Glyphicon glyph="info-sign"/ >
            </OverlayTrigger>
          </label>

          <div className={classes.inputs}>
            {ETHNICITY_CHOICES.map(_ethnicity => (
              <div className={classes.toggleInputGroup}>
                <label>
                  <ArrayCheckbox field={ethnicity} value={_ethnicity}/>
                  {_ethnicity}
                </label>
              </div>
            ))}

            <div>
              <label className={classes.otherInput}>
                Other
                <input
                  className={classes.otherTextInput}
                  type="text"
                  {...ethnicityOther}
                  onChange={(value) => ethnicityOther.onChange(value) && ethnicity.onChange(value)}
                />
              </label>
            </div>
          </div>
          {ethnicityOther.touched && ethnicityOther.error && <span className={classes.errorMessage}>{ethnicityOther.error}</span>}
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Primary Language</label>
          <div className={classes.inputs}>
            {LANGUAGE_CHOICES.map(_language => (
              <div className={classes.toggleInputGroup}>
                <label>
                  <input
                    type="radio"
                    {...language}
                    key={_language}
                    value={_language}
                    checked={language.value === _language}
                    onChange={(value) => language.onChange(value) && languageOther.onChange("")}
                  />
                  {_language}
                </label>
              </div>
            ))}

            <div>
              <label className={classes.otherInput}>
                Other
                <input
                  className={classes.otherTextInput}
                  type="text"
                  {...languageOther}
                  onChange={(value) => languageOther.onChange(value) && language.onChange(value)}
                />
              </label>
            </div>
          </div>
          {languageOther.touched && languageOther.error && <span className={classes.errorMessage}>{languageOther.error}</span>}
        </div>
      </div>

      <div className={classes.background + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Have you ever been in foster care?</label>
          <div className={classes.horizontalInputs}>
            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  type="radio"
                  {...hasBeenInFosterCare}
                  value="true"
                  checked={hasBeenInFosterCare.value === "true"}
                />
                Yes
              </label>
            </div>

            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  type="radio"
                  {...hasBeenInFosterCare}
                  value="false"
                  checked={hasBeenInFosterCare.value === "false"}
                />
                No
              </label>
            </div>
          </div>
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Have you ever served in the military?</label>
          <div className={classes.horizontalInputs}>
            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  type="radio"
                  {...hasServedInTheMilitary}
                  value="true"
                  checked={hasServedInTheMilitary.value === "true"}
                />
                Yes
              </label>
            </div>

            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  type="radio"
                  {...hasServedInTheMilitary}
                  value="false"
                  checked={hasServedInTheMilitary.value === "false"}
                />
                No
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Where do you usually go for healthcare when you are not feeling well?</label>
          {primaryHealthcareLocation.touched && primaryHealthcareLocation.error && <span className={classes.errorMessage}>{primaryHealthcareLocation.error}</span>}
          <Select
            {...primaryHealthcareLocation}
            name="primaryHealthcareLocationSelect"
            value={primaryHealthcareLocation.value || ''}
            onBlur={() => primaryHealthcareLocation.onBlur(primaryHealthcareLocation.value)}
            options={PRIMARY_HEALTHCARE_CHOICES}
          />
        </div>
      </div>

      <div className={classes.homeless + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>Are you currently homeless?</label>
          <div className={classes.horizontalInputs}>
            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  type="radio"
                  {...isHomeless}
                  value="true"
                  checked={isHomeless.value === "true"}
                />
                Yes
              </label>
            </div>

            <div className={classes.toggleInputGroup}>
              <label>
                <input
                  type="radio"
                  {...isHomeless}
                  value="false"
                  checked={isHomeless.value === "false"}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {
          /* only show the duration if ``isHomeless`` */
          isHomeless.value === "true" &&
            <div className={classes.inputGroup}>
              <label className={classes.fieldName}>How long have you been homeless for?</label>
              <Select
                {...lengthOfHomelessness}
                name="primaryHealthcareLocationSelect"
                value={lengthOfHomelessness.value || ''}
                onBlur={() => lengthOfHomelessness.onBlur(lengthOfHomelessness.value)}
                options={LENGTH_OF_HOMELESSNESS_CHOICES}
              />
            </div>
        }
      </div>

      <div className={classes.medical + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>What medical services would you like today?</label>
          <Grid>
            <Row>
              {MEDICAL_CHOICES.map(_medicalChoice => (
                <Col xs={12} sm={6}>
                  <label>
                    <ArrayCheckbox field={medicalServices} value={_medicalChoice} />
                    {_medicalChoice}
                  </label>
                </Col>
              ))}
            </Row>
          </Grid>
        </div>
      </div>

      <div className={classes.support + " " + classes.section}>
        <div className={classes.inputGroup}>
          <label className={classes.fieldName}>What support services would you like today?</label>
          <Grid>
            <Row>
              {SUPPORT_CHOICES.map(_supportChoice => (
                <Col xs={12} sm={6}>
                  <label>
                    <ArrayCheckbox field={supportServices} value={_supportChoice} />
                    {_supportChoice}
                  </label>
                </Col>
              ))}
            </Row>
          </Grid>
        </div>
      </div>

      <div className={classes.footer}>
        <Button
          bsStyle="primary"
          type="submit"
          disabled={requesting}
        >
          { requesting ? "Submitting..." : "Submit" }
        </Button>
        <Button
          type="button"
          disabled={requesting}
          onClick={_onClear}
        >
          Clear Values
        </Button>
      </div>

      {
        (() => {
          let hasErrors = false;
          for (let key in errors) {
            hasErrors = true;
          }

          return (
            <div className={classes.errorNotice + (hasErrors && submitFailed ? "" : " hidden") }>
              Required fields are missing! Please review the form.
            </div>
          )
        })()
      }
    </form>
  )
}

CheckInForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  requesting: PropTypes.bool.isRequired,
  updateInfo: PropTypes.func.isRequired,
  clearInfo: PropTypes.func.isRequired,
}

export default CheckInForm
