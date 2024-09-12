// Origin zip code (32835)
const originZipCode = '32835';

// Function to display the Installation form and hide others
function showInstallation() {
    document.getElementById('installation-form').style.display = 'block';
    document.getElementById('removal-form').style.display = 'none';
    document.getElementById('service-selection').style.display = 'none';
    document.getElementById('result').innerText = ''; // Clear any previous results
}

// Function to go back to the service selection screen
function goBack() {
    document.getElementById('installation-form').style.display = 'none';
    document.getElementById('removal-form').style.display = 'none';
    document.getElementById('service-selection').style.display = 'block';
    document.getElementById('result').innerText = '';
}

// Function to calculate the installation estimate and zip code distance
function calculateInstallation() {
    const width = parseFloat(document.getElementById('install-width').value);
    const height = parseFloat(document.getElementById('install-height').value);
    const difficulty = document.getElementById('install-difficulty').value;
    const customerZipCode = document.getElementById('zipcode').value;

    // Base cost per square meter for installation
    let baseCost = 10;
    if (difficulty === 'moderate') {
        baseCost += 5;
    } else if (difficulty === 'hard') {
        baseCost += 10;
    }

    // Calculate area and total cost
    const area = width * height;
    const totalCost = baseCost * area;

    // Calculate distance from 32835
    calculateDistanceFromOrigin(customerZipCode, function(distance) {
        if (distance) {
            // Distance result (in meters)
            const travelTimeInHours = distance.duration.value / 3600; // Convert from seconds to hours

            if (travelTimeInHours > 1) {
                document.getElementById('result').innerText = `Estimated Installation Cost: $${totalCost.toFixed(2)}\nNote: Your location is more than 1 hour away.`;
            } else {
                document.getElementById('result').innerText = `Estimated Installation Cost: $${totalCost.toFixed(2)}`;
            }
        } else {
            document.getElementById('result').innerText = 'Error calculating distance. Please check the zip code.';
        }
    });
}

// Function to calculate the distance between two zip codes using Google Maps API
function calculateDistanceFromOrigin(destinationZipCode, callback) {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [originZipCode],
        destinations: [destinationZipCode],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC
    }, function(response, status) {
        if (status === 'OK' && response.rows[0].elements[0].status !== 'ZERO_RESULTS') {
            const element = response.rows[0].elements[0];
            callback(element);
        } else {
            callback(null); // Handle error
        }
    });
}
