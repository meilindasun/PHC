export const EventRegistration = 'Event_Registration__c'

// TODO: Redo the way this works
// - The frontend should be an object that looks like this: { displayName, value }
// - The backend should be able to easily translate this value to the column label in the database
// - The backend then queries Salesforce for the list of active events

export const FORM_FIELD_TO_SALESFORCE_FIELD = {
  // Medical Services
  'Acupuncture': 'Acupuncture__c',
  'Addiction and Harm Reduction Services': 'Addiction_Support__c',
  'Dental': 'Dental__c',
  'HIV, STI, and Hepatitis C Testing': 'HIV_STI_Testing__c',
  // 'Mammograms': '',  // TODO: This isn't in the form?
  'Massage': 'Massage__c',
  'Medical': 'Medical__c',
  'Mental Health': 'Mental_Health__c',
  'Needle Exchange': 'Needle_Exchange__c',
  'Podiatry': 'Podiatry__c',
  'Vision Readers': 'Vision_Readers__c',
  'Vision Prescription (voucher required)': 'Vision_Prescription__c',

  // Support Services
  'Adult Probation': 'Adult_Probation__c',
  'Banking': 'Banking__c',
  'Books and Library Cards': 'Books__c',
  'CAAP': 'CAAP__c',
  'CalFresh': 'CalFresh__c',
  'Disability Services': 'Disability_Services__c',
  'DMV ID (Must have previous CA ID or copy of Birth Cert., Passport or Military ID)': 'DMV_ID__c',
  'Employment': 'Employment__c',
  'Family Services': 'Family_Services__c',
  'Foot Washing': 'Foot_Washing__c',
  'Haircuts': 'Haircuts__c',
  'Homeward Bound': 'Homeward_Bound__c',
  'Housing and Shelter Info': 'Housing_Info__c',
  'Legal': 'Legal__c',
  'Lifeline Cell Phones (Tag Mobile)': 'Phone_Calls__c',
  'Pet Care (outside in Plaza)': 'Pet_Care__c',
  'Phone Calls and Voicemail (Sprint and Google)': 'Voicemail__c',
  'Photo Booth': 'Portraits__c',
  'Senior Services': 'Senior_Services__c',
  'Showers (Lava Mae)': 'Showers__c',
  'Medi-Cal': 'SSI_SSDI_Medi_Cal__c',
  // 'SSI/SSDI/Medi-Cal': 'SSI_SSDI_Medi_Cal__c',
  'Veteran Services': 'Veteran_Services__c',
  'Wheelchair Repair': 'Wheelchair_Repair__c',
  'Women\'s and Domestic Violence Services': 'Women_Services__c',
  'Youth Services (up to age 24)': 'Youth_Services__c',
  'Lunch': 'Lunch__c',
  'Groceries': 'Groceries__c'
}

export const EventPicklistValues = {
  APPLIED: 'Applied',
  RECEIVED: 'Received',
  DROP_IN: 'Drop In',
}

// TODO: Fetch the latest PHC Event and cache the lastest id beforehand.
export const PHC_EVENT_ID = 'a0R40000008oL8d'