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

The methods in bold are the ones which are needed to be completed. The others are helper methods which are already complete. Offcourse, there are others methods too, which are responsible for setting up of Camera View. If you want to learn about it, head to the Android Developers site [here](https://developer.android.com/guide/topics/media/camera.html).

<a name="setAugmentedRealityPoint"/>

## setAugmentedRealityPoint

This function will set the POI.

<a name="calculatetheoreticalazimuth"/>

## calculateTheoreticalAzimuth

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