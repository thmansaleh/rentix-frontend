$files = @(
"src/app/cases/[id]/edit/tasks/AddTaskModal.js",
"src/app/cases/[id]/edit/tasks/EditTaskModal.js", 
"src/app/cases/[id]/edit/petitions/EditPetitionModal.js",
"src/app/cases/[id]/edit/petitions/AddPetitionModal.js",
"src/app/cases/[id]/edit/stages/AddCaseDegreeModal.js",
"src/app/cases/[id]/edit/stages/DeleteCaseDegreeModal.js",
"src/app/cases/[id]/edit/stages/EditCaseDegreeModal.js",
"src/app/cases/[id]/edit/parties/components/AddPartyToTableModal.js",
"src/app/cases/[id]/edit/notifications/EditJudicialOrderModal.js",
"src/app/cases/[id]/edit/notifications/AddJudicialOrderModal.js",
"src/app/cases/[id]/edit/info/Files.js",
"src/app/cases/[id]/edit/executions/EditExecutionModal.js",
"src/app/cases/[id]/edit/executions/AddExecutionModal.js",
"src/app/cases/[id]/edit/employees/EmployeeFiles.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Replace Upload and X in imports
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
