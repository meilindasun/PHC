import Q from 'q'
import logger from '../../lib/logger'
import { transformDateForSalesforce, transformDateFromSalesforce } from './transform'

const Account = 'Account'

const FETCH_ACCOUNTS_QUERY = 'SELECT Id, FirstName, LastName FROM Account'

// TODO: Merge these two mapping functions together.
const FORM_FIELD_TO_SALESFORCE_FIELD = {
  firstName: 'FirstName',
  lastName: 'LastName',
  socialSecurityNumber: 'SS_Num__c',
  dateOfBirth: 'Birthdate__c',
  phoneNumber: 'Phone',
  emailAddress: 'PersonEmail',
  gender: 'Gender__c',
  isLGBTQ: 'Identify_as_GLBT__c',
  ethnicity: 'Race__c',
  language: 'Primary_Language__c',
  hasBeenInFosterCare: 'Foster_Care__c',
  hasServedInTheMilitary: 'Veteran__c',
  primaryHealthcareLocation: 'Where_do_you_usually_go_for_healthcare__c',
  isHomeless: 'Housing_Status_New__c',  // TODO: Is this right?
  lengthOfHomelessness: 'How_long_have_you_been_homeless__c',
}

// TODO: Wrap any transformation logic in a function called `transformDateFromSalesforce`
function mapSalesforceAccountToPrimaryInfo(account) {
  return {
    firstName: account.FirstName,
    lastName: account.LastName,
    socialSecurityNumber: account.SS_Num__c,
    dateOfBirth: transformDateFromSalesforce(account.Birthdate__c),
    phoneNumber: account.Phone,
    emailAddress: account.PersonEmail,
    gender: 'male',//account.Gender__c.toLowerCase(),
    //isTransexual: account.Gender__c.toLowerCase() === 'transgender',
    isLGBTQ: account.Identify_as_GLBT__c,
    // Salesforce serializes into 'race1;race2;race3 eg. African American;Asian / Pacific Islander'; we pass down array
    ethnicity: account.Race__c && account.Race__c.split(';'),
    ethnicityOther: account.Other_Race__c,
    language: account.Primary_Language__c,
    // This field doesn't exist yet in salesforce so it will be null. @TODO: Recreate in salesforce
    languageOther: account.Other_Language__c,
    hasBeenInFosterCare: account.Foster_Care__c.toString(),
    hasServedInTheMilitary: account.Veteran__c.toString(),
    primaryHealthcareLocation: account.Where_do_you_usually_go_for_healthcare__c,
    isHomeless: (account.Housing_Status_New__c === 'Homeless').toString(),
    lengthOfHomelessness: account.How_long_have_you_been_homeless__c
  }
}

// TODO: Move this to `transform.js`, and only export this function.
// Performs any additional transformations needed to coerce a field so Salesforce will accept it
function transformFieldForSalesforce (value, field) {
  if (field === 'Birthdate__c') {
    return transformDateForSalesforce(value)
  } else if (field === 'SS_Num__c') {
    return value && value.replace(/-/g, '')
  } else if (value instanceof Array) {
    return value.join(';')
  } else {
    return value
  }
}

export function logApiUsage (connection) {
  if (connection.limitInfo.apiUsage) {
    logger.debug('API Limit: ' + connection.limitInfo.apiUsage.limit)
    logger.debug('API Used: ' + connection.limitInfo.apiUsage.used)
  }

  return {
    connection,
  }
}

export function fetchAccounts(connection) {
  const deferred = Q.defer()
  const accounts = []

  logger.debug('Fetching accounts: starting')
  connection.bulk.query(FETCH_ACCOUNTS_QUERY)
    .on('record', (record) => {
      accounts.push(record)
    })
    .on('end', () => {
      logger.debug('Fetching accounts: complete', )
      deferred.resolve({
        message: 'Successfully fetched ' + accounts.length + ' accounts!',
        payload: {
          accounts: records.map((account) => {
            return {
              name: `${account.FirstName} ${account.LastName}`,
              id: account.Id
            }
          })
        },
      })
    })
    .on('error', (error) => {
      logger.warn('Fetching accounts: error', { error})
      deferred.reject({
        message: 'Error fetching accounts.',
        error,
      })
    })

  return deferred.promise
}

export function getAccount(connection, id) {
  if (connection.limitInfo.apiUsage) {
    logger.verbose('API Limit: ' + connection.limitInfo.apiUsage.limit)
    logger.verbose('API Used: ' + connection.limitInfo.apiUsage.used)
  }

  const deferred = Q.defer()

  logger.debug('Fetching account: requesting', { id })

  connection.sobject(Account).retrieve(id, (error, account) => {
    logger.debug('Fetching account: request complete', account)

    if (error) {
      logger.error('Fetching account: error', { id, error })
      deferred.reject({
        message: `Error fetching account ${id}.`,
        error,
      })
    } else {
      const payload = {
        account: mapSalesforceAccountToPrimaryInfo(account)
      }

      payload.account.id = account.Id

      deferred.resolve({
        message: `Successfully retrieved account ${id}`,
        payload,
      })
    }
  })

  return deferred.promise
}

function createAccount(connection, payload) {
  const deferred = Q.defer()

  logger.debug('Creating account: requesting', payload)

  connection.sobject(Account).create(payload, (error, account) => {
    logger.debug('Creating account: request complete', account)

    if (error || !account.success) {
      logger.error('Creating account: error', { error })
      deferred.reject({
        message: `Error creating account.`,
        error,
      })
    } else {
      deferred.resolve({
        message: `Successfully created account ${account.id}.`,
        payload: {
          account: {
            id: account.id,
          },
        },
      })
    }
  })

  return deferred.promise
}

function updateAccount(connection, payload) {
  const deferred = Q.defer()

  logger.debug('Updating account: requesting', payload)

  connection.sobject(Account).update(payload, (error, account) => {
    logger.debug('Updating account: request complete', account)

    if (error || !account.success) {
      logger.error('Updating account: error', { error })
      deferred.reject({
        message: `Error updating account.`,
        error,
      })
    } else {
      deferred.resolve({
        message: `Successfully updated account ${account.id}.`,
        payload: {
          account: {
            id: account.id,
          },
        },
      })
    }
  })

  return deferred.promise
}

export function createOrUpdateAccount(connection, id, fields) {
  const payload = {}

  logger.debug('Creating or updating account: parsing fields', { fields })

  for (let field in fields) {
    if (field in FORM_FIELD_TO_SALESFORCE_FIELD) {
      const sfColumnName = FORM_FIELD_TO_SALESFORCE_FIELD[field]
      payload[sfColumnName] = transformFieldForSalesforce(fields[field], sfColumnName)
    }
  }

  if (id) {
    payload['Id'] = id
    return updateAccount(connection, payload)
  } else {
    return createAccount(connection, payload)
  }
}
