pipeline {
    agent {
        node {
            label ''
            customWorkspace 'D:\\Jenkins_pipeline'
        }
    }
    
    tools {
        // Requires NodeJS plugin to be installed and NodeJS configured in Global Tool Configuration
        nodejs 'node'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm cache clean --force'
                bat 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Linting code...'
                bat 'npm run lint'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                bat 'npm run build'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Build was successful.'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
