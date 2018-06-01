#!groovy

node('docker') {
  stage('SCM') {
    checkout scm
  }

  stage('Build') {
    sh '''#!/bin/bash -ex
      docker run -i \
        -e JEKYLL_UID=$(id -u) \
        -v "$PWD:/srv/jekyll" \
        jekyll/jekyll@sha256:166284174af3bbaba0f8dd318426c8de8735049ee82b400960a9b34fee87ff98 \
        jekyll build
      sudo chown -R $USER _site
    '''
  }

  stage('Stage') {
      withCredentials([[
        $class: 'AmazonWebServicesCredentialsBinding',
        credentialsId: '943846ae-8bde-4bdd-904b-39df4c1ae66c',
        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
    ]]) {
      sh '''#!/bin/bash -ex
        docker run -t \
          -v "${PWD}/_site:/site" \
          -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
          -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
          jess/awscli@sha256:a054249fa7b4247dee0dce965acc8444edeffe3ec4d310c8d5ce467deb139c3a \
          --region=us-west-2 \
          s3 sync --acl public-read /site s3://wobscale-website-staging.wobscale.website/wobscale-website-stage-${BUILD_NUMBER}/
      '''

      githubNotify account: 'wobscale', credentialsId: '693f6ba4-ab12-4881-a3e3-7c7ce6bca7d2', description: 'staged', repo: 'wobscale.website', status: 'SUCCESS', targetUrl: "https://s3-us-west-2.amazonaws.com/wobscale-website-staging.wobscale.website/wobscale-website-stage-${env.BUILD_NUMBER}/index.html"
    }
  }
}
