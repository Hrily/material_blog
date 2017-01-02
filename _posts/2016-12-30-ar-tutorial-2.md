---
layout: post
title: "Augmented Reality App in Android : Tutorial - Part 2"
description: "Make your own Location based Augmented Reality Android App"
tags: ["Android", "Augmented Reality"]
---

Hie,

Welcome to the **Augmented Reality App in Android : Tutorial - Part 2**. I hope you liked and understood the Part 1 of the tutorial. If you haven't been to the it, please goto the Part 1.

<br>
<a href="https://hrily.github.io/blog/2016/12/22/ar-tutorial-1.html">
	<button class="btn pink waves-effect waves-light" name="action">Go to Part 1
		<i class="material-icons right">send</i>
	</button>
</a>

<br>
In Part 1, we have seen what is the Theory behind the Augmented Reality. Now it's the implementation time.

I hope you have familiarity with Android Studio as this Tutorial prerequisites it. If not, go ahead, learn about it, and come back later for this Tutorial.

I've priovided a starter pack for this Tutorial to give you a kickstart. Download or clone it from the repository. Then Open the project in Android Studio by navigating to it's directory.

<br>
<a href="https://github.com/Hrily/ARTutorial_Starter/archive/master.zip">
	<button class="btn pink waves-effect waves-light" name="action">Download Starter Pack
		<i class="material-icons right">file_download</i>
	</button>
</a>

<br>
-OR-

Clone it

```shell
git clone https://github.com/Hrily/ARTutorial_Starter.git
```

Now open `MainActivity.java` in your Android Studio editor, this is where we will be coding. It has following methods:

+ [setAugmentedRealityPoint](#setaugmentedrealitypoint)
+ [**calculateTheoreticalAzimuth**](#calculatetheoreticalazimuth)
+ [calculateAzimuthAccuracy](#calculateazimuthaccuracy)
+ [**isBetween**](#isbetween)
+ [updateDescription](#updatedescription)
+ [onLocationChanged](#onlocationchanged)
+ [**onAzimuthChanged**](#onazimuthchanged)

The methods in bold are the ones which are needed to be completed. The others are helper methods which are already complete. Offcourse, there are some others methods too, which are responsible for setting up of Camera View and Sensor events. If you want to learn about it, head to the Android Developers site [here](https://developer.android.com/guide/topics/media/camera.html) and [here](https://developer.android.com/reference/android/hardware/SensorEvent.html).

<a name="setaugmentedrealitypoint"/>

##### setAugmentedRealityPoint

This function will set the POI.

<a name="calculatetheoreticalazimuth"/>

##### calculateTheoreticalAzimuth

This function will calculate the Azimuth angle(&phi;) for POI. From Part 1, we know that

> _tan(&phi;) = dy/dx_

So we will first calculate `dx` and `dy`, then _tan(&phi;)_, and then by applying _tan<sup>-1</sup>_ to _tan(&phi;)_, we will get &phi; and convert it from radians to degrees. But this &phi; always is between 0 and 90 as _tan<sup>-1</sup>_ is defined only in this range. But we have `dx` and `dy` which give us clear idea about the quadrant of POI. We will just check different conditions on `dx` and `dy` and get correct &phi;.

Following code demonstrates it:

```java
public double calculateTheoreticalAzimuth() {
	// Calculates azimuth angle (phi) of POI
	double dX = mPoi.getPoiLatitude() - mMyLatitude;
	double dY = mPoi.getPoiLongitude() - mMyLongitude;

	double phiAngle;
	double tanPhi;

	tanPhi = Math.abs(dY / dX);
	phiAngle = Math.atan(tanPhi);
	phiAngle = Math.toDegrees(phiAngle);

	// phiAngle = [0,90], check quadrant and return correct phiAngle
	if (dX > 0 && dY > 0) { // I quadrant
	    return phiAngle;
	} else if (dX < 0 && dY > 0) { // II
	    return 180 - phiAngle;
	} else if (dX < 0 && dY < 0) { // III
	    return 180 + phiAngle;
	} else if (dX > 0 && dY < 0) { // IV
	    return 360 - phiAngle;
	}

	return phiAngle;
}
```

<a name="calculateazimuthaccuracy"/>

##### calculateAzimuthAccuracy

This function calculates the Camera View Sector of Device. It return minAngle and maxAngle of Camera View Sector.

<a name="isbetween"/>

##### isBetween

This function checks if POI lies between the Camera View Sector. To do this, we just check if the azimuth angle is between the minAngle and maxAngle of the Camera View Sector. But this isn't enough. Sometimes, minAngle is greater than maxAngle. In that case we just check if azimuth lies in 0 and maxAngle OR minAngle and 360.

Following code illustrates above procedure:

```java
 private boolean isBetween(double minAngle, double maxAngle, double azimuth) {
	// Checks if the azimuth angle lies in minAngle and maxAngle of Camera View Sector
	if (minAngle > maxAngle) {
		if (isBetween(0, maxAngle, azimuth) || isBetween(minAngle, 360, azimuth))
			return true;
	} else if (azimuth > minAngle && azimuth < maxAngle)
		return true;
	return false;
}
```

<a name="updatedescription"/>

##### updateDescription

This function just updates the values shown in textbox. It is for testing function.

<a name="onlocationchanged"/>

##### onLocationChanged

This function takes care of the change in location of Device. It updates the location and recalculates the azimuth angle of POI.

<a name="onazimuthchanged"/>

##### onAzimuthChanged

This function takes care of the change in azimuth angle of the device. This is the method where the real thing happens, i.e. to augment the POI. Here, we have the Device's azimuth angle and the azimuth angle of the POI. First, we add 90&deg; to azimuth angle of Device (Remember...), then we calculate the Camera View Sector. Then we check if POI lies in the Camera View Sector, if yes then we show pointer icon on the screen. In order to give the augmented feel, we place the pointer icon on screen proportional to where the POI is in the sector. This is done by calculating the ratio of difference of azimuth angle and minimum angle of sector to that of difference of minimum and maximum angle of sector. Then the top margin of pointer icon is set to product of ratio and screen height.

```java
public void onAzimuthChanged(float azimuthChangedFrom, float azimuthChangedTo) {
	// Function to handle Change in azimuth angle
	mAzimuthReal = azimuthChangedTo;
	mAzimuthTheoretical = calculateTheoreticalAzimuth();

	// Since Camera View is perpendicular to device plane
	mAzimuthReal = (mAzimuthReal+90)%360;

	pointerIcon = (ImageView) findViewById(R.id.icon);

	double minAngle = calculateAzimuthAccuracy(mAzimuthReal).get(0);
	double maxAngle = calculateAzimuthAccuracy(mAzimuthReal).get(1);

	if (isBetween(minAngle, maxAngle, mAzimuthTheoretical)) {
		float ratio = ((float) (mAzimuthTheoretical - minAngle + 360.0) % 360) / ((float) (maxAngle - minAngle + 360.0) % 360);
		RelativeLayout.LayoutParams lp = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
		lp.topMargin = (int) (display.getHeight() * ratio);
		lp.leftMargin = display.getWidth()/2 - pointerIcon.getWidth();
		pointerIcon.setLayoutParams(lp);
		pointerIcon.setVisibility(View.VISIBLE);
	} else {
		pointerIcon.setVisibility(View.GONE);
	}

	updateDescription();
}
```

That's it. Now you can build the app, deploy and test it on your device. In case you need the completed project, you can get it below.

<br>
<a href="https://github.com/Hrily/ARTutorial">
	<button class="btn pink waves-effect waves-light" name="action">View Full Project
		<i class="material-icons right">send</i>
	</button>
</a>

<br>
**Note:** If the app says "Using Game Rotation Vector. Direction may not be accurate!", then your device doesn't have compass i.e. the device can't locate North. The angle available in this case is not relative to North but somewhere else. More information [here](https://source.android.com/devices/sensors/sensor-types.html#game_rotation_vector).