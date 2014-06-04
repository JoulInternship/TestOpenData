package com.byjoul.code.lib.geo.model.shape;

import java.util.Iterator;

import com.byjoul.code.lib.geo.model.TrailCoordinates;
import com.byjoul.code.lib.json.JsonSpawn;

/**
 * Everything you always wanted to know about TrailShapes (but were afraid to ask)
 * Can be used as a naive class for wrapping info, converting to and from JSON,
 * generating/getting the immutable geometrical computation friendly object,
 * etc.
 * All attributes are nullable, but may result in invalid or inconsistent shape descriptors
 * 
 * @author lionel
 *
 */
public class TrailShapeInfo implements TrailShape, TrailShapeReference, JsonSpawn {
	/**
	 * eclipse auto generated
	 */
	private static final long serialVersionUID = -8292339307846167381L;

	public String uri;
	
	/**
	 * Related shapes will share the same meta... sometimes ^^
	 */
	public String meta;
	public String name;
	public String desc;
	
	public Float offset;
	public TrailCoordinates[] points;
	
	public float[] linearOffset;
	public float[] linearLength;
	
	public TrailShapeInfo(){}
	
	public TrailShapeInfo(TrailShape shape){
		points = shape.getPoints();
		linearLength = shape.getDistances();
		linearOffset = shape.getOffsets();
		//Note we do not set offset (redundant)
	}
	
	public TrailShapeInfo(TrailShape shape, TrailShapeReference ref){
		this(shape);
		uri = ref.getShapeURI();
	}
	
	/**
	 * Not lazy. Costly. Overwrites offsets and distances with computed values if valid
	 * @return null if invalid
	 */
	@Override
	public ImmutableTrailShape getOrCompute(){
		if(isValid()){
			ImmutableTrailShape s = new ImmutableTrailShape(points, offset == null ? 0 : offset);
			linearLength = s.linearLength;
			linearOffset = s.linearOffset;
			offset = null; //Redundant now
			return s;
		}
		return null;
	}
	
	public void setUri(String id){
		uri = id;
	}

	@Override
	public String getShapeURI() {
		return uri;
	}

	@Override
	public boolean sameShape(TrailShapeReference ref) {
		return TrailShapeReference.Util.same(this, ref);
	}

	@Override
	public Iterator<TrailSegment> iterator() {
		return new TrailShapeIterator(this);
	}

	@Override
	public int getNumberOfSegments() {
		return points.length - 1;
	}

	@Override
	public TrailCoordinates[] getPoints() {
		return points;
	}
	
	//TODO safe lazy working shape (transient immutable?) atm this will NULLPOINTER. Some kind of delegate/wrapper?

	@Override
	public float[] getOffsets() {
		return linearOffset;
	}

	@Override
	public float[] getDistances() {
		return linearLength;
	}
	
	@Override
	public boolean isValid() {
		return uri != null && points != null && points.length > 1;
	}

	@Override
	public float getLength(){
		return getEndOffset() - getOffset();
	}
	
	@Override
	public float getLength(int segmentIndex){
		return linearLength[segmentIndex];
	}
	
	@Override
	public float getOffset(int segmentIndex){
		return linearOffset[segmentIndex];
	}
	
	@Override
	public float getOffset(){
		return getOffset(0);
	}
	
	@Override
	public float getEndOffset(){
		return getEndOffset(getNumberOfSegments() - 1);
	}
	
	@Override
	public float getEndOffset(int segmentIndex){
		return linearOffset[segmentIndex] + linearLength[segmentIndex];
	}
}