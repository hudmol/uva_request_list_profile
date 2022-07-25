module UvaTopdesk
  class ResourceMapper < ItemMapper

    RequestList.register_item_mapper(self, :uva_topdesk, Resource)

    def request_permitted?(item)
      # only if childless
      ArchivesSpaceClient.instance.get_raw_record(item['uri'] + '/tree/root')['child_count'] == 0
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
      }

      return [as_topdesk_request(shared_fields)] unless mapped.container.has_multi?

      mapped.container.multi.map {|c|
        as_topdesk_request(with_mapped_container(mapped, shared_fields, c))
      }
    end

  end
end
