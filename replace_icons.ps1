$files = @(
"src/app/employees/PermissionsDialog.js",
"src/app/employees/AddEmployeeDialog.js", 
"src/app/employees/edit/EditEmployeeDialog.js",
"src/app/employees/ViewEmployeeDialog.js",
"src/app/components/navigation/AppSidebar.js",
"src/app/cases/sessions/EditSessionModal.js",
"src/app/cases/sessions/DeleteSessionDialog.js",
"src/app/cases/[id]/edit/petitions/EditPetitionModal.js",
"src/app/cases/add-case/tasks/TaskModal.js",
"src/app/cases/[id]/edit/tasks/AddTaskModal.js",
"src/app/cases/[id]/edit/petitions/AddPetitionModal.js",
"src/app/cases/add-case/sessions/sessions.js",
"src/app/cases/add-case/petition/PetitionModal.js",
"src/app/cases/add-case/parties/components/AddPartyToTableModal.js",
"src/app/cases/[id]/edit/tasks/EditTaskModal.js",
"src/app/cases/add-case/parties/components/EditPartyModal.js",
"src/app/cases/add-case/parties/Files.js",
"src/app/cases/add-case/petition/EditPetitionModal.js",
"src/app/cases/add-case/judicial-notices/JudicialNotices.js",
"src/app/cases/[id]/edit/stages/AddCaseDegreeModal.js",
"src/app/cases/[id]/edit/stages/DeleteCaseDegreeModal.js",
"src/app/cases/[id]/edit/stages/EditCaseDegreeModal.js",
"src/app/cases/[id]/edit/parties/components/AddPartyToTableModal.js",
"src/app/cases/add-case/info/Files.js",
"src/app/cases/[id]/edit/notifications/EditJudicialOrderModal.js",
"src/app/cases/[id]/edit/notifications/AddJudicialOrderModal.js",
"src/app/cases/[id]/edit/info/Files.js",
"src/app/cases/add-case/execution/ExecutionModal.js",
"src/app/cases/[id]/edit/executions/EditExecutionModal.js",
"src/app/cases/[id]/edit/employees/EmployeeFiles.js",
"src/app/cases/add-case/court/CourtFiles.js",
"src/app/cases/add-case/employees/Files.js",
"src/app/cases/[id]/edit/executions/AddExecutionModal.js",
"src/app/cases/add-case/case-degrees/AddCaseDegreeModal.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Replace Upload and X imports with Plus and Minus
        $content = $content -replace '(\bUpload\b)(?=.*from.*[''"]lucide-react[''"])', 'Plus'
        $content = $content -replace '(\bX\b)(?=.*from.*[''"]lucide-react[''"])', 'Minus'
        
        # Replace Upload icon usage
        $content = $content -replace '<Upload(\s+className=)', '<Plus$1'
        
        # Replace X icon usage  
        $content = $content -replace '<X(\s+className=)', '<Minus$1'
        
        Set-Content $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}
