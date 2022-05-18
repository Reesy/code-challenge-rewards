pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        nodejs('Node 16') {
          sh 'npm i'
        }

      }
    }

    stage('Build') {
      steps {
        nodejs('Node 16') {
          sh 'npm run build'
        }

      }
    }

    stage('Test') {
      steps {
        nodejs('Node 16') {
          sh 'npm run test'
        }

      }
    }

  }
}