$OutputFile = "$PSScriptRoot\audit_result.txt"
Clear-Content -Path $OutputFile -ErrorAction SilentlyContinue

function Log-Result ($Msg) {
    Add-Content -Path $OutputFile -Value $Msg
}

Log-Result "=== RESULTATS DE L'AUDIT WINBOOSTER ==="

function Check-Opti ($Name, $Path, $Key, $Expected) {
    $val = (Get-ItemProperty -Path $Path -Name $Key -ErrorAction SilentlyContinue).$Key
    if ($val -eq $Expected) {
        Log-Result "[ACTIF] $Name"
    } else {
        Log-Result "[INACTIF] $Name (Valeur actuelle: $val)"
    }
}

Check-Opti "System Responsiveness 0%" "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "SystemResponsiveness" 0
Check-Opti "Priorité CPU Extreme" "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl" "Win32PrioritySeparation" 40
Check-Opti "Désactivation NDU" "HKLM:\SYSTEM\CurrentControlSet\Services\Ndu" "Start" 4
Check-Opti "TCP Window Scaling" "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" "Tcp1323Opts" 1
Check-Opti "Clavier 0 Input Lag" "HKCU:\Control Panel\Accessibility\Keyboard Response" "AutoRepeatDelay" 200
Check-Opti "Souris Fast Buffers" "HKLM:\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" "MouseDataQueueSize" 20
Check-Opti "Désactivation Spectre/Meltdown" "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" "FeatureSettingsOverride" 3

Log-Result "=== FIN DE L'AUDIT ==="
Write-Host "L'audit est termine ! Le fichier audit_result.txt a ete genere. L'IA peut maintenant le lire !" -ForegroundColor Green
Pause
