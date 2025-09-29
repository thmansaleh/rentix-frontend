# نظام إدارة الأطراف - Parties Management System

هذا النظام يوفر واجهة شاملة لإدارة الأطراف في القضايا القانونية.

## المكونات (Components)

### 1. Parties.js
المكون الرئيسي الذي يحتوي على النظام كاملاً

### 2. PartyTypeSelector
مكون لاختيار نوع الطرف (عميل أو خصم)

### 3. PartySelector  
مكون لاختيار الطرف من قائمة الأطراف المتاحة

### 4. AddPartyModal
نافذة منبثقة لإضافة طرف جديد

## الخطافات (Hooks)

### useParties
خطاف مخصص لإدارة بيانات الأطراف باستخدام SWR

```javascript
const { parties, isLoading, error, mutate, getPartiesByType, getPartyById } = useParties(branchId);
```

## واجهة برمجة التطبيقات (API)

### getPartiesByBranch(branchId)
جلب جميع الأطراف لفرع معين

### createParty(partyData)
إنشاء طرف جديد

البيانات المطلوبة:
- name (مطلوب)
- phone (مطلوب) 
- party_type (مطلوب): 'client' أو 'opponent'
- address
- e_id
- category: 'individual', 'company', 'government'
- email
- username
- password
- status
- nationality
- branch_id

## الاستخدام

```javascript
import Parties from './parties/Parties';

function MyComponent() {
  return (
    <div>
      <Parties />
    </div>
  );
}
```

## الميزات

- ✅ اختيار نوع الطرف (عميل/خصم)
- ✅ عرض قائمة الأطراف المتاحة
- ✅ إضافة طرف جديد من خلال نافذة منبثقة
- ✅ عرض تفاصيل الطرف المحدد
- ✅ دعم التحديث التلقائي بعد إضافة طرف جديد
- ✅ حالات التحميل والأخطاء
- ✅ واجهة باللغة العربية