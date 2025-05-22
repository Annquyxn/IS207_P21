def get_engine(name):
    engines = {
        # Original models
        "gemma": "gemma3:1b",
        "deepseek": "deepseek-r1",
        "llama": "llama3.2",
        "moondream": "moondream",
        
        # Models from the React frontend
        "llama3": "llama3.2",
        "llama2": "llama2",
        "mixtral": "mixtral",
        "qwen": "qwen:7b",
    }
    return engines.get(name, "deepseek-r1")