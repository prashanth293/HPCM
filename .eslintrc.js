module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parser":"babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "experimentalDecorators": true
        },
        "sourceType": "module"
    },
    "rules": {
        "eqeqeq": "error",
        "indent": [
            "error",
            4
        ],
        "semi": [
            "error",
            "always"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "no-this-before-super": "warn",
        "valid-typeof": "warn",
        "space-before-blocks" : 1,
        "arrow-spacing" : [
            "error", {
                "before": true,
                "after": true
            }
        ],
        "keyword-spacing" : [
            "error", {
                "before": true
            }
        ],
        "comma-spacing": [
            "error", {
                "before": false,
                "after": true
            }
        ],
        "key-spacing" : [
            "error", {
                "beforeColon": false,
                "afterColon":true
            }
        ]
    }
};