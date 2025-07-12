# Model Drift Detection Example

Przykład kodu do dodania w `monitoring_service.py`:

```python
import numpy as np
import json

class DriftMonitor:
    def __init__(self, baseline_path):
        with open(baseline_path, 'r') as f:
            self.baseline = json.load(f)

    def check_drift(self, new_metrics):
        drift_report = {}
        for key, baseline_value in self.baseline.items():
            new_value = new_metrics.get(key)
            if new_value is not None:
                # Prosty test statystyczny: odchylenie > 3x std
                std = np.std([baseline_value, new_value])
                if abs(new_value - baseline_value) > 3 * std:
                    drift_report[key] = {
                        'baseline': baseline_value,
                        'current': new_value,
                        'drift': True
                    }
        return drift_report
```

- Plik baseline (np. `baseline_metrics.json`) powinien zawierać wartości referencyjne.
- Funkcja `check_drift` zwraca raport o wykrytym drifcie.
- Dodaj wywołanie tej klasy w pipeline monitoringu modelu.
