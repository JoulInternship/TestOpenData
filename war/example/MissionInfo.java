package com.byjoul.code.zenbus.servlets.api;

import java.io.Serializable;
import java.util.HashMap;

import com.byjoul.code.lib.geo.model.shape.TrailShapeReference;
import com.byjoul.code.lib.json.JsonSpawn;

public class MissionInfo implements JsonSpawn, Serializable, TrailShapeReference {

	/**
	 * eclipse auto-generated
	 */
	private static final long serialVersionUID = -2920614443356858412L;

	public String uri;
	
	public String shape;
	
	/**
	 * Point index (inclusive)
	 */
	public Integer startShape;
	
	/**
	 * Point index (inclusive)
	 */
	public Integer stopShape;
	
	public POIAnchors pois;
	
	public String name;
	public String desc;
	public String meta;
	
	public MissionInfo(){}
	
	@Override
	public boolean isValid() {
		return uri != null;
	}
	
	/**
	 * N:N relationship between POIs and their anchor vertexes (in this shape).
	 * Key: PointOfInterest URI
	 * Value: anchor point(s) in the shape
	 * @author lionel
	 *
	 */
	public static class POIAnchors extends HashMap<String, Integer[]>{
		/**
		 * eclipse auto-generated
		 */
		private static final long serialVersionUID = -6526547998377261440L;
		
	}

	@Override
	public String getShapeURI() {
		return shape;
	}

	@Override
	public boolean sameShape(TrailShapeReference ref) {
		return TrailShapeReference.Util.same(this, ref);
	}
}