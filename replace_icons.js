const fs = require('fs');
const path = require('path');

// List of files that need icon replacement
const filesToUpdate = [
  'src/app/cases/sessions/EditSessionModal.js',
  'src/app/cases/sessions/DeleteSessionDialog.js',
  'src/app/employees/ActivityLogModal.js',
  'src/app/employees/PermissionsDialog.js',
  'src/app/employees/AddEmployeeDialog.js',
  'src/app/cases/[id]/edit/petitions/EditPetitionModal.js',
  'src/app/cases/add-case/tasks/TaskModal.js',
  'src/app/cases/[id]/edit/tasks/AddTaskModal.js',
  'src/app/cases/[id]/edit/petitions/AddPetitionModal.js',
  'src/app/cases/add-case/sessions/sessions.js',
  'src/app/cases/add-case/petition/PetitionModal.js',
  'src/app/cases/add-case/parties/components/AddPartyToTableModal.js',
  'src/app/cases/[id]/edit/tasks/EditTaskModal.js',
  'src/app/cases/add-case/parties/components/EditPartyModal.js',
  'src/app/cases/add-case/parties/Files.js',
  'src/app/cases/add-case/petition/EditPetitionModal.js',
  'src/app/cases/add-case/judicial-notices/JudicialNotices.js',
  'src/app/cases/[id]/edit/stages/AddCaseDegreeModal.js',
  'src/app/cases/[id]/edit/stages/DeleteCaseDegreeModal.js',
  'src/app/cases/[id]/edit/stages/EditCaseDegreeModal.js',
  'src/app/cases/[id]/edit/parties/components/AddPartyToTableModal.js',
  'src/app/cases/add-case/info/Files.js',
  'src/app/cases/[id]/edit/notifications/EditJudicialOrderModal.js',
  'src/app/cases/[id]/edit/notifications/AddJudicialOrderModal.js',
  'src/app/cases/[id]/edit/info/Files.js',
  'src/app/cases/add-case/execution/ExecutionModal.js',
  'src/app/cases/[id]/edit/executions/EditExecutionModal.js',
  'src/app/cases/[id]/edit/employees/EmployeeFiles.js',
  'src/app/cases/add-case/court/CourtFiles.js',
  'src/app/cases/add-case/employees/Files.js',
  'src/app/cases/[id]/edit/executions/AddExecutionModal.js',
  'src/app/cases/add-case/case-degrees/AddCaseDegreeModal.js'
];

function replaceIconsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace imports
    content = content.replace(
      /import\s*\{\s*([^}]*)\s*\}\s*from\s*["']lucide-react["']/g,
      (match, imports) => {
        const cleanImports = imports
          .split(',')
          .map(imp => imp.trim())
          .filter(imp => imp !== 'Upload' && imp !== 'X')
          .concat(['Plus', 'Minus'])
          .filter((imp, index, arr) => arr.indexOf(imp) === index) // Remove duplicates
          .join(', ');
        return `import { ${cleanImports} } from "lucide-react"`;
      }
    );
    
    // Replace Upload icon usage
    content = content.replace(/<Upload\s+className=/g, '<Plus className=');
    
    // Replace X icon usage
    content = content.replace(/<X\s+className=/g, '<Minus className=');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Update all files
filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    replaceIconsInFile(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Icon replacement complete!');