module UvaTopdesk
  class ResourceMapper < ItemMapper

    RequestList.register_item_mapper(self, :uva_topdesk, Resource)

    def request_permitted?(item)
      # not if restrictions
      return false if item['json']['restrictions']

      # not if it has children
      return false if ArchivesSpaceClient.instance.get_raw_record(item['uri'] + '/tree/root')['child_count'] > 0

      # otherwise permitted
      return true
    end

    def map_extensions(mapped, item, repository, resource, resource_json)
      super
      mapped.ext(:finding_aid_author).name = item['json']['finding_aid_author']
      mapped.ext(:related_accession).name = item['json']['related_accessions'].map{|ra| ra['ref']}.join(', ')
    end

    def form_fields(mapped)
      shared_fields = {
        'resource_title'      => mapped.collection.name,
        'resource_id'         => mapped.collection.id,
        'resource_uri'        => mapped.collection.uri,

        'creator'             => mapped.creator.name,
        'date'                => mapped.date.name,
        'location'            => mapped.ext(:location).name,
        'physical_location'   => mapped.ext(:physical_location).name,
        'access_restrictions' => mapped.collection.ext(:access_restrictions),
        'finding_aid_author'  => mapped.ext(:finding_aid_author).name,
        'related_accession'   => mapped.ext(:related_accession).name,
      }

      return [as_topdesk_request(shared_fields)] unless mapped.container.has_multi?

      mapped.container.multi.map {|c|
        as_topdesk_request(with_mapped_container(mapped, shared_fields, c))
      }
    end

  end
end
