package com.byjoul.code.zenbus.servlets.api;

import java.io.Serializable;

import com.byjoul.code.lib.json.JsonSpawn;

public class PointOfInterestInfo implements JsonSpawn, Serializable {

	/**
	 * eclipse auto-generated
	 */
	private static final long serialVersionUID = -322179444042447883L;

	public String uri;
	
	public String name;
	public String desc;
	public String meta;
	
	public Float latitude;
	public Float longitude;
	
	public String geo;
	
	@Override
	public boolean isValid() {
		return (latitude != null && longitude != null) || geo != null;
	}
}
