timeking
========

Uses the Harvest API to visualize how many hours the employees has registered this month in your studio.
Groups them into 4 groups; Karmahunters, Goalies, Karmausers and Slackers.

Getting started
* copy inc/settings.sample.php to inc/settings.php and fill in your Harvest credentials.
* check that the inc/cache folder has been created, and make sure it has the proper credentials ("chmod 0777 cache/" will do the trick)

Requirements
* php5-curl must be installed