pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    ansiColor('xterm')
  }

  parameters {
    choice(name: 'TEST_GROUP', choices: ['smoke', 'sanity', 'regression', 'cross-browser'], description: 'Playwright execution group')
    booleanParam(name: 'RUN_IN_K8S', defaultValue: false, description: 'Run tests via Kubernetes Job')
  }

  environment {
    CI = 'true'
    TEST_ENV = 'qa'
    BUILD_URL_FROM_JENKINS = "${env.BUILD_URL}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Execute Tests') {
      steps {
        script {
          if (params.RUN_IN_K8S) {
            sh 'kubectl apply -f orchestration/kubernetes/tests/playwright-job.yaml'
            sh 'kubectl wait --for=condition=complete job/playwright-tests --timeout=900s'
          } else {
            sh "bash orchestration/scripts/run-group.sh ${params.TEST_GROUP}"
          }
        }
      }
    }

    stage('Generate Allure') {
      steps {
        sh 'npm run report:allure:generate'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'report/playwright-report/**, report/allure-report/**, report/allure-results/**, report/test-results/**', fingerprint: true, allowEmptyArchive: true
      allure includeProperties: false, jdk: '', results: [[path: 'report/allure-results']]
      withEnv(["JENKINS_BUILD_URL=${env.BUILD_URL}", "ALLURE_REPORT_URL=${env.BUILD_URL}allure"]) {
        sh 'npm run notify:slack'
      }
    }
  }
}
