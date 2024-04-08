# Species Catalogue

## Description

Species Catalogue is a web-based interactive application that allows visitors of
Manuels River to explore and learn about various species found along its banks.
Users can discover detailed information about each species, including images,
descriptions, and habitat maps, enhancing their educational and visiting
experience.

Although this app is fully functional as a standalone tool for species
identification and learning, its integration with a REST API backend could
potentially enable features like user profiles, saving favorite species, and
more interactive and personalized experiences.

## Motivation

Having worked at Manuels River for almost a decade, currently in a leadership role responsible for education, I've developed a profound appreciation for its natural beauty and biodiversity. Recognizing the need to share this treasure with both locals and tourists in an engaging way, we aimed to go beyond traditional guidebooks. Our goal was to create an interactive, informative, and accessible tool that enhances the learning experience about the diverse species inhabiting this unique environment.

## Features

- **Species Selection:** Browse through a categorized list of species found
  along Manuels River.
- **Favorites:** Mark species as favorites for easy access during future visits.
- **Detailed Descriptions:** Learn about each species with detailed descriptions
  and beautiful imagery.
- **Interactive Maps:** View the habitats and locations of species within the
  Manuels River area.

## Built With

- HTML
- CSS (TailwindCSS for styling)
- JavaScript (For interactive features)
- [TailwindCSS](https://tailwindcss.com/) (For utility-first styling)
- [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) (For
  development dependencies and building the project)

## Getting Started

To explore the Species Catalogue:

1. Visit the live site:
   [Species Catalogue](https://justindotrocks.github.io/Species/)

## Deployment and Local Development

### Building the Project

To build the project for deployment, run the following command:

This command compiles your project assets into the `src/` directory (or another
directory if configured differently), making it ready for deployment.

### Deploying to GitHub Pages

This project is configured to be deployed on GitHub Pages using the `gh-pages`
package. To redeploy or make changes to the deployment, follow these steps:

1. Make sure you've built the project with the latest changes:
      ```
      yarn build
      ```
2. Deploy the project to GitHub Pages: ` yarn deploy ` This `deploy` command is
   a script defined in your `package.json` that executes the necessary steps to
   update your GitHub Pages site. It typically involves pushing the contents of
   your build directory to the `gh-pages` branch of your repository.

### TailwindCSS Build Script

The `build-css` script in the `package.json` file is responsible for compiling
the TailwindCSS styles. It uses the Tailwind CLI to process your CSS file,
applying the utility classes and generating the final CSS that will be used in
your project. Here's a breakdown of what each part of the script does:

- `tailwindcss build`: This is the command to tell Tailwind to start building
  your CSS.
- `src/workingCSSFile/styles.css`: This specifies the path to your source CSS
  file. This file should contain all your Tailwind directives and custom CSS.
- `-o src/styles.css`: This part specifies the output file. The `-o` flag stands
  for "output," and `src/styles.css` is the path where the processed CSS file
  will be saved.

In summary, this script takes your development CSS file, processes it with
TailwindCSS to apply all utility classes and custom styles, and then outputs the
final CSS to `src/styles.css`, ready to be included in your HTML files.

### Running Locally

After cloning the project and navigating to the directory:

1. Install dependencies:
      ```
      yarn install
      ```
2. Start the project locally: ` yarn start ` This will run a local server,
   usually accessible at `http://localhost:3000`, where you can see your
   application running. Note that due to the deployment-specific configurations
   for GitHub Pages, some paths or resources might not load as expected when
   running the project locally.

### Note on Local Development and Deployment

After deploying to GitHub Pages, some local paths may need adjustment to reflect
the deployed structure. Ensure that paths used for assets and API requests are
relative and correctly configured for both local and production environments.
This ensures that the application runs smoothly regardless of the environment.

Please note: This app is actively being developed, and new features are
continuously being added.

## About

The Species Catalogue project aims to bridge the gap between technology and
nature conservation, providing a platform for education and engagement with the
biodiversity of Manuels River.

## Contributors

- [Justin Smith](https://github.com/JustinDotRocks) - Web Developer

Feel free to contribute or suggest improvements via GitHub.
