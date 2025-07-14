# Unique ID System Documentation

## Overview

The system now generates unique IDs for patients, doctors, and pharmacists based on their birth date and a sequential counter. This provides a human-readable, sortable, and unique identifier for each user.

## ID Format

### Patient IDs
- **Format**: `PAT-YYYYMM-XXXXXXXXXX`
- **Example**: `PAT-1995030000000001`
- **Components**:
  - `PAT`: Fixed prefix for patients
  - `YYYYMM`: Birth year (4 digits) + birth month (2 digits)
  - `XXXXXXXXXX`: Sequential counter (10 digits, zero-padded)

### Doctor IDs
- **Format**: `DOC-YYYYMM-XXXXXX`
- **Example**: `DOC-198011000001`
- **Components**:
  - `DOC`: Fixed prefix for doctors
  - `YYYYMM`: Birth year (4 digits) + birth month (2 digits)
  - `XXXXXX`: Sequential counter (6 digits, zero-padded)

### Pharmacist IDs
- **Format**: `PHC-YYYYMM-XXXXXX`
- **Example**: `PHC-198507000001`
- **Components**:
  - `PHC`: Fixed prefix for pharmacists
  - `YYYYMM`: Birth year (4 digits) + birth month (2 digits)
  - `XXXXXX`: Sequential counter (6 digits, zero-padded)

## Implementation Details

### Database Schema Changes

#### Patient Model
```javascript
patientId: {
  type: String,
  unique: true,
  required: true,
  trim: true
}
```

#### Doctor Model
```javascript
doctorId: {
  type: String,
  unique: true,
  required: true,
  trim: true
}
```

#### Pharmacist Model
```javascript
pharmacistId: {
  type: String,
  unique: true,
  required: true,
  trim: true
}
```

### Counter System

The system uses a `Counter` model to track sequential numbers for each year-month combination:

```javascript
const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    default: 1
  }
});
```

Counter keys follow the pattern: `{type}_{YYYYMM}` (e.g., `patient_199503`, `doctor_198011`)

### Automatic Generation

IDs are automatically generated when a new record is created using Mongoose pre-save middleware:

```javascript
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const patientId = await generatePatientId(birthDate);
    this.patientId = patientId;
  }
  next();
});
```

## Usage Examples

### Generating IDs

```javascript
const { generatePatientId, generateDoctorId, generatePharmacistId } = require('./utils/idGenerator');

const patientId = await generatePatientId(new Date('1995-03-15'));

const doctorId = await generateDoctorId(new Date('1980-11-22'));

const pharmacistId = await generatePharmacistId(new Date('1985-07-08'));
```

### Validating IDs

```javascript
const { validateIdFormat } = require('./utils/idGenerator');

const isValid = validateIdFormat('PAT-1995030000000001', 'patient');
```

### Parsing IDs

```javascript
const { parseId } = require('./utils/idGenerator');

const info = parseId('PAT-1995030000000001');

```

## Migration

For existing records, run the migration script:

```bash
cd backend
node migrations/add-unique-ids.js
```

This will:
1. Find all records without unique IDs
2. Generate IDs based on user age or current date
3. Save the new IDs to the database

## API Response Changes

### Patient Profile
```json
{
  "patientId": "PAT-1995030000000001",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 28
  }
}
```

### Doctor Profile
```json
{
  "doctorUniqueId": "DOC-198011000001",
  "specialization": "Cardiology"
}
```

### Pharmacist Profile
```json
{
  "pharmacistUniqueId": "PHC-198507000001",
  "pharmacyName": "City Pharmacy"
}
```

## Benefits

1. **Human Readable**: Easy to identify user type and birth period
2. **Sortable**: Natural chronological ordering
3. **Unique**: Guaranteed uniqueness within the system
4. **Scalable**: Supports millions of users per month
5. **Traceable**: Can extract birth information from ID

## Limitations

1. **Birth Date Dependency**: Requires accurate birth date information
2. **Month-based Counter**: Resets counter each month
3. **Fixed Length**: Limited by counter digit length

## Future Enhancements

1. **Custom Birth Dates**: Allow manual birth date input
2. **ID Regeneration**: Ability to regenerate IDs if needed
3. **Validation Rules**: Additional format validation
4. **Bulk Operations**: Efficient bulk ID generation 