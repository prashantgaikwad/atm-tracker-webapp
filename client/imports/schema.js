const AtmForm = {
  FormName: 'AtmForm',
  Schema: {
    value: {
      displayName: 'Status',
      docField: 'status',
      type: 'SELECT',
      menuItems: [
        { value: 'NO_CASH', primaryText: 'No Cash' },
        { value: 'CASH_AVAILABLE_SHORT_QUEUE', primaryText: 'Cash Available Short Queue' },
        { value: 'CASH_WITH_LONG_QUEUE', primaryText: 'Cash Available Long Queue' },
      ],
      isRequired: true,
    },
    name: {
      displayName: 'Volunteer name',
      docField: 'name',
      type: 'TEXT',
    },
  },
};

export default LocationForm;