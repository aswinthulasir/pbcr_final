import { FIELD_VISIBILITY } from './types';
import { FIELD_TYPES } from './fieldTypes';

export const shouldShowField = (fieldName, visibility) => {
  const getFieldType = (name) => {
    const parts = name.split('.');
    let currentType = FIELD_TYPES;
    
    for (const part of parts) {
      if (!currentType || !currentType[part]) {
        return undefined;
      }
      currentType = currentType[part];
    }
    
    const fieldType = typeof currentType === 'string' ? currentType : undefined;
    console.log(`Field: ${name}, Type: ${fieldType}, Visibility: ${visibility}`);
    return fieldType;
  };

  const fieldType = getFieldType(fieldName);
  
  if (!fieldType) {
    return false;
  }

  if (visibility === FIELD_VISIBILITY.ALL) {
    return true;
  }

  if (visibility === FIELD_VISIBILITY.RECOMMENDED) {
    return fieldType === 'mandatory' || fieldType === 'recommended';
  }

  if (visibility === FIELD_VISIBILITY.MANDATORY) {
    return fieldType === 'mandatory';
  }

  return false;
};